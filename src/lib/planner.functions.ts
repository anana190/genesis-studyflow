import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BlockSchema = z.object({
  time_label: z.string(),
  duration: z.string(),
  title: z.string(),
  tag: z.string(),
  priority: z.enum(["high", "med", "low"]),
  reason: z.string(),
});

export const generatePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { goal: string }) =>
    z.object({ goal: z.string().min(1).max(500) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const prompt = `You are an expert study planner. Generate a focused, realistic study schedule for today based on this goal: "${data.goal}".
Return 5-7 time blocks covering deep work, active recall, short breaks, and lighter tasks. Use 24h time labels like "08:30".
Each block needs: time_label, duration (e.g. "45m", "1h 30m"), title, tag (one of: Deep Work, Memory, Build, Writing, Practice, Recovery, Review), priority (high|med|low), and a short reason.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You output only valid JSON matching the requested schema." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "emit_plan",
              description: "Emit the generated study plan",
              parameters: {
                type: "object",
                properties: {
                  blocks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        time_label: { type: "string" },
                        duration: { type: "string" },
                        title: { type: "string" },
                        tag: { type: "string" },
                        priority: { type: "string", enum: ["high", "med", "low"] },
                        reason: { type: "string" },
                      },
                      required: ["time_label", "duration", "title", "tag", "priority", "reason"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["blocks"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "emit_plan" } },
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached. Try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Lovable Cloud.");
      throw new Error(`AI request failed: ${txt}`);
    }

    const json = await res.json();
    const toolCall = json.choices?.[0]?.message?.tool_calls?.[0];
    const args = toolCall ? JSON.parse(toolCall.function.arguments) : null;
    const parsed = z.object({ blocks: z.array(BlockSchema).min(1).max(12) }).parse(args);

    const today = new Date().toISOString().slice(0, 10);

    // Clear today's blocks and replace
    await supabase.from("schedule_blocks").delete().eq("user_id", userId).eq("block_date", today);

    const rows = parsed.blocks.map((b, i) => ({
      user_id: userId,
      block_date: today,
      time_label: b.time_label,
      duration: b.duration,
      title: b.title,
      tag: b.tag,
      priority: b.priority,
      reason: b.reason,
      sort_order: i,
    }));

    const { error } = await supabase.from("schedule_blocks").insert(rows);
    if (error) throw new Error(error.message);

    return { count: rows.length };
  });
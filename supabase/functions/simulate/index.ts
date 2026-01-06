import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/**
 * CORS configuration
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

/**
 * System instruction for counterfactual analysis
 */
const SYSTEM_PROMPT = `
You are an expert strategic analyst specializing in counterfactual reasoning and decision post-mortems.

CRITICAL RULES:
1. Generate PLAUSIBLE counterfactuals grounded in realistic cause-and-effect chains.
2. Never judge or evaluate the user's actual decision.
3. Explicitly acknowledge uncertainty using probabilistic language.
4. Maintain an analytical, neutral tone — no coaching or motivation.
5. Focus on structural outcomes: capabilities, constraints, resources, and options.
6. Account for second- and third-order effects.

OUTPUT FORMAT (STRICT JSON ONLY):

{
  "alternate_timelines": [
    {
      "path_name": "string",
      "narrative": "string"
    }
  ],
  "avoided_tradeoffs": ["string"],
  "hidden_costs": ["string"],
  "irreversibility_signals": ["string"],
  "reflection_summary": "string"
}
`.trim();

/**
 * Expected request payload
 */
interface SimulationRequest {
  decision_context: string;
  chosen_path: string;
  paths_not_taken: string;
  time_horizon: string;
}

/**
 * Entry point
 */
serve(async (req) => {
  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: SimulationRequest = await req.json();

    const {
      decision_context,
      chosen_path,
      paths_not_taken,
      time_horizon,
    } = body;

    if (!decision_context || !chosen_path || !paths_not_taken || !time_horizon) {
      return new Response(
        JSON.stringify({ error: "Invalid request payload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const API_KEY = Deno.env.get("LLM_API_KEY");
    const API_ENDPOINT = Deno.env.get("LLM_ENDPOINT");

    if (!API_KEY || !API_ENDPOINT) {
      throw new Error("LLM service configuration is missing");
    }

    const userPrompt = `
DECISION CONTEXT:
${decision_context}

CHOSEN PATH:
${chosen_path}

PATHS NOT TAKEN:
${paths_not_taken}

TIME HORIZON:
${time_horizon}

Generate the counterfactual analysis following system constraints.
`.trim();

    const llmResponse = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        temperature: 0.7,
        max_tokens: 2000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!llmResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Analysis service unavailable" }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const raw = await llmResponse.json();
    const content = raw?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No analysis content returned");
    }

    let result;
    try {
      const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonPayload = match ? match[1] : content;
      result = JSON.parse(jsonPayload);
    } catch {
      throw new Error("Failed to parse model output");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Internal error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

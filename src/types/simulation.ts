export interface AlternateTimeline {
  path_name: string;
  narrative: string;
}

export interface SimulationResult {
  alternate_timelines: AlternateTimeline[];
  avoided_tradeoffs: string[];
  hidden_costs: string[];
  irreversibility_signals: string[];
  reflection_summary: string;
}

export interface SimulationRequest {
  decision_context: string;
  chosen_path: string;
  paths_not_taken: string;
  time_horizon: string;
}

export type TimeHorizon = "6 months" | "1 year" | "5 years";

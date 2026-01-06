import { useState } from "react";
import { SimulationForm } from "@/components/SimulationForm";
import { SimulationResults } from "@/components/SimulationResults";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { SimulationRequest, SimulationResult } from "@/types/simulation";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: SimulationRequest) => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data: response, error } = await supabase.functions.invoke("simulate", {
        body: data,
      });

      if (error) {
        throw new Error(error.message || "Failed to generate simulation");
      }

      if (response.error) {
        throw new Error(response.error);
      }

      setResult(response as SimulationResult);
    } catch (error) {
      console.error("Simulation error:", error);
      toast({
        title: "Simulation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-6 py-6">
          <h1 className="font-display text-2xl font-medium text-foreground tracking-tight">
            PathNotTaken
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16 max-w-2xl">
          <h2 className="font-display text-4xl md:text-5xl font-medium text-foreground mb-4 leading-tight">
            Explore the roads you didn't travel.
          </h2>
          <p className="text-lg text-muted-foreground font-body leading-relaxed">
            A strategic reflection tool for examining alternate timelines, hidden tradeoffs, 
            and opportunity costs of past decisions.
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1fr,1.2fr] lg:gap-24">
          {/* Form Section */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-8">
              <div className="mb-6">
                <h3 className="font-display text-xl font-medium text-foreground mb-1">
                  Decision Input
                </h3>
                <p className="text-sm text-muted-foreground">
                  Provide context about a decision you've made and the paths you didn't take.
                </p>
              </div>
              <SimulationForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>

          {/* Results Section */}
          <div className="order-1 lg:order-2">
            {result ? (
              <SimulationResults result={result} />
            ) : (
              <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border/60 bg-card/30">
                <div className="text-center px-8">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <svg
                      className="h-6 w-6 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-display text-lg text-foreground mb-2">
                    No analysis yet
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Fill in the decision details on the left to generate your counterfactual analysis.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-24">
        <div className="container mx-auto px-6 py-8">
          <p className="text-sm text-muted-foreground text-center">
            Strategic reflection tool for examining alternate timelines and opportunity costs.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

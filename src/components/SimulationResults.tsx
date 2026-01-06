import { GitBranch, Shield, AlertTriangle, Lock, FileText, Download } from "lucide-react";
import { ResultSection } from "./ResultSection";
import { Button } from "./ui/button";
import { exportToPdf } from "@/utils/pdfExport";
import type { SimulationResult } from "@/types/simulation";

interface SimulationResultsProps {
  result: SimulationResult;
}

export function SimulationResults({ result }: SimulationResultsProps) {
  const handleExportPdf = () => {
    exportToPdf(result);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-3xl font-medium text-foreground">
            Counterfactual Analysis
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPdf}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
        <div className="h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />
      </div>

      {/* Alternate Timelines */}
      <ResultSection
        title="Alternate Timelines"
        icon={<GitBranch className="h-4 w-4" />}
        delay={100}
      >
        <div className="space-y-4">
          {result.alternate_timelines.map((timeline, index) => (
            <div key={index} className="border-l-2 border-primary/30 pl-4 py-1">
              <h4 className="font-medium text-foreground mb-1">{timeline.path_name}</h4>
              <p className="text-muted-foreground">{timeline.narrative}</p>
            </div>
          ))}
        </div>
      </ResultSection>

      {/* Tradeoffs Avoided */}
      <ResultSection
        title="Tradeoffs Avoided"
        icon={<Shield className="h-4 w-4" />}
        delay={200}
      >
        <ul className="space-y-2">
          {result.avoided_tradeoffs.map((tradeoff, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
              <span className="text-muted-foreground">{tradeoff}</span>
            </li>
          ))}
        </ul>
      </ResultSection>

      {/* Hidden Costs */}
      <ResultSection
        title="Hidden Costs of the Chosen Path"
        icon={<AlertTriangle className="h-4 w-4" />}
        delay={300}
      >
        <ul className="space-y-2">
          {result.hidden_costs.map((cost, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive/60 shrink-0" />
              <span className="text-muted-foreground">{cost}</span>
            </li>
          ))}
        </ul>
      </ResultSection>

      {/* Irreversibility Signals */}
      <ResultSection
        title="Irreversibility Signals"
        icon={<Lock className="h-4 w-4" />}
        delay={400}
      >
        <ul className="space-y-2">
          {result.irreversibility_signals.map((signal, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent/60 shrink-0" />
              <span className="text-muted-foreground">{signal}</span>
            </li>
          ))}
        </ul>
      </ResultSection>

      {/* Reflection Summary */}
      <ResultSection
        title="Reflection Summary"
        icon={<FileText className="h-4 w-4" />}
        delay={500}
      >
        <p className="text-muted-foreground italic">{result.reflection_summary}</p>
      </ResultSection>
    </div>
  );
}

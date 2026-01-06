import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { SimulationRequest, TimeHorizon } from "@/types/simulation";

interface SimulationFormProps {
  onSubmit: (data: SimulationRequest) => void;
  isLoading: boolean;
}

export function SimulationForm({ onSubmit, isLoading }: SimulationFormProps) {
  const [decisionContext, setDecisionContext] = useState("");
  const [chosenPath, setChosenPath] = useState("");
  const [pathsNotTaken, setPathsNotTaken] = useState("");
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>("1 year");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      decision_context: decisionContext,
      chosen_path: chosenPath,
      paths_not_taken: pathsNotTaken,
      time_horizon: timeHorizon,
    });
  };

  const isFormValid = decisionContext.trim() && chosenPath.trim() && pathsNotTaken.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <Label htmlFor="decision-context" className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Decision Context
        </Label>
        <Textarea
          id="decision-context"
          placeholder="Describe the situation, constraints, and time period when you made this decision..."
          value={decisionContext}
          onChange={(e) => setDecisionContext(e.target.value)}
          className="min-h-[120px]"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="chosen-path" className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Chosen Path
        </Label>
        <Textarea
          id="chosen-path"
          placeholder="What did you actually choose? Describe the decision you made..."
          value={chosenPath}
          onChange={(e) => setChosenPath(e.target.value)}
          className="min-h-[100px]"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="paths-not-taken" className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Paths Not Taken
        </Label>
        <Textarea
          id="paths-not-taken"
          placeholder="List the alternative options you seriously considered but did not pursue. One per line works well..."
          value={pathsNotTaken}
          onChange={(e) => setPathsNotTaken(e.target.value)}
          className="min-h-[140px]"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="time-horizon" className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Time Horizon
        </Label>
        <Select
          value={timeHorizon}
          onValueChange={(value: TimeHorizon) => setTimeHorizon(value)}
          disabled={isLoading}
        >
          <SelectTrigger id="time-horizon">
            <SelectValue placeholder="Select time horizon" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6 months">6 months</SelectItem>
            <SelectItem value="1 year">1 year</SelectItem>
            <SelectItem value="5 years">5 years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        variant="hero"
        size="lg"
        className="w-full"
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Generating Counterfactuals...</span>
          </>
        ) : (
          "Generate Counterfactuals"
        )}
      </Button>
    </form>
  );
}

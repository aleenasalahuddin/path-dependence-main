import { ReactNode } from "react";

interface ResultSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  delay?: number;
}

export function ResultSection({ title, icon, children, delay = 0 }: ResultSectionProps) {
  return (
    <section 
      className="opacity-0 animate-fade-in-up rounded-lg border border-border bg-card p-6 shadow-card"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="mb-4 flex items-center gap-3">
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <h3 className="font-display text-xl font-medium text-foreground">{title}</h3>
      </div>
      <div className="text-secondary-foreground font-body leading-relaxed">
        {children}
      </div>
    </section>
  );
}

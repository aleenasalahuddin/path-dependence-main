import jsPDF from "jspdf";
import type { SimulationResult } from "@/types/simulation";

export function exportToPdf(result: SimulationResult): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(30, 30, 30);
  doc.text("PathNotTaken", margin, yPosition);
  yPosition += 8;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Counterfactual Analysis Report", margin, yPosition);
  yPosition += 4;

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 12;

  // Section helper
  const addSection = (title: string, items: string[], isBulleted = true) => {
    checkPageBreak(20);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text(title, margin, yPosition);
    yPosition += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);

    items.forEach((item) => {
      const prefix = isBulleted ? "• " : "";
      const lines = doc.splitTextToSize(prefix + item, contentWidth - 5);
      
      checkPageBreak(lines.length * 5 + 4);
      
      lines.forEach((line: string, index: number) => {
        doc.text(index === 0 ? line : "  " + line, margin + 2, yPosition);
        yPosition += 5;
      });
      yPosition += 2;
    });

    yPosition += 6;
  };

  // Alternate Timelines
  checkPageBreak(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text("Alternate Timelines", margin, yPosition);
  yPosition += 8;

  result.alternate_timelines.forEach((timeline) => {
    checkPageBreak(25);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text(timeline.path_name, margin + 2, yPosition);
    yPosition += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    
    const narrativeLines = doc.splitTextToSize(timeline.narrative, contentWidth - 5);
    narrativeLines.forEach((line: string) => {
      checkPageBreak(6);
      doc.text(line, margin + 2, yPosition);
      yPosition += 5;
    });
    yPosition += 6;
  });

  yPosition += 4;

  // Other sections
  addSection("Tradeoffs Avoided", result.avoided_tradeoffs);
  addSection("Hidden Costs of the Chosen Path", result.hidden_costs);
  addSection("Irreversibility Signals", result.irreversibility_signals);

  // Reflection Summary
  checkPageBreak(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text("Reflection Summary", margin, yPosition);
  yPosition += 8;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  const summaryLines = doc.splitTextToSize(result.reflection_summary, contentWidth);
  summaryLines.forEach((line: string) => {
    checkPageBreak(6);
    doc.text(line, margin, yPosition);
    yPosition += 5;
  });

  // Footer on last page
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated on ${date}`, margin, pageHeight - 10);

  // Save
  doc.save("counterfactual-analysis.pdf");
}

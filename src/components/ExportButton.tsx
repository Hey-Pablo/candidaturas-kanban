import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { JobCard } from "@/types";

interface ExportButtonProps {
  cards: JobCard[];
}

export function ExportButton({ cards }: ExportButtonProps) {
  function handleExport() {
    const dataStr = JSON.stringify(cards, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `candidaturas-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      title="Exportar dados como JSON"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Exportar</span>
    </Button>
  );
}

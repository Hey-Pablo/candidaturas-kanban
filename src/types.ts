export type ColumnId = "saved" | "applied" | "interview" | "closed";

export interface JobCard {
  id: string;
  empresa: string;
  cargo: string;
  link: string;
  data: string;
  cor: string;
  notas: string;
  coluna: ColumnId;
}

export interface Column {
  id: ColumnId;
  titulo: string;
  icone: string;
}

export const COLUNAS: Column[] = [
  { id: "saved", titulo: "Salvas", icone: "📌" },
  { id: "applied", titulo: "Inscrições", icone: "📝" },
  { id: "interview", titulo: "Entrevista", icone: "🎯" },
  { id: "closed", titulo: "Encerradas", icone: "✅" },
];

export const CORES_ETIQUETA: Record<string, string> = {
  azul: "bg-blue-500",
  verde: "bg-emerald-500",
  vermelha: "bg-red-500",
  amarela: "bg-yellow-500",
  roxa: "bg-violet-500",
  laranja: "bg-orange-500",
  rosa: "bg-pink-500",
  ciano: "bg-cyan-500",
};

export const CORES_ETIQUETA_BG: Record<string, string> = {
  azul: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  verde: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  vermelha: "bg-red-500/20 text-red-300 border-red-500/30",
  amarela: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  roxa: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  laranja: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  rosa: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  ciano: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

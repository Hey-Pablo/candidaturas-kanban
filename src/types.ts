export type ColumnId = "saved" | "applied" | "interview" | "closed";

export interface JobCard {
  id: string;
  empresa: string;
  cargo: string;
  link: string;
  data: string;
  validade: string;
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

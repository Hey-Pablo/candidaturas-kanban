import { Draggable } from "@hello-pangea/dnd";
import { Pencil, Trash2, ExternalLink } from "lucide-react";

import { type JobCard, CORES_ETIQUETA_BG } from "@/types";
import { formatarData } from "@/lib/date";

interface KanbanCardProps {
  card: JobCard;
  index: number;
  onEdit: (card: JobCard) => void;
  onDelete: (id: string) => void;
}

export function KanbanCard({ card, index, onEdit, onDelete }: KanbanCardProps) {
  const corClasse = CORES_ETIQUETA_BG[card.cor] ?? "";

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group rounded-lg border bg-card p-3 transition-all ${
            snapshot.isDragging
              ? "rotate-2 scale-105 shadow-xl shadow-primary/20 border-primary/40"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          {/* Label de cor */}
          {card.cor && (
            <span
              className={`mb-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${corClasse}`}
            >
              {card.cor}
            </span>
          )}

          {/* Título */}
          <h3 className="font-semibold text-sm leading-tight">{card.cargo}</h3>

          {/* Empresa */}
          <p className="mt-0.5 text-xs text-muted-foreground">
            {card.empresa}
          </p>

          {/* Data */}
          {card.data && (
            <p className="mt-1 text-[10px] text-muted-foreground/60">
              {formatarData(card.data)}
            </p>
          )}

          {/* Notas preview */}
          {card.notas && (
            <p className="mt-1.5 line-clamp-2 text-[11px] text-muted-foreground/70">
              {card.notas}
            </p>
          )}

          {/* Link */}
          {card.link && (
            <a
              href={card.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Link da vaga
            </a>
          )}

          {/* Actions */}
          <div className="mt-2 flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(card);
              }}
              className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              title="Editar"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id);
              }}
              className="rounded p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Excluir"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

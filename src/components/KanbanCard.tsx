import { Draggable } from "@hello-pangea/dnd";
import { Pencil, Trash2, ExternalLink, AlertTriangle, Clock } from "lucide-react";

import { type JobCard } from "@/types";
import { formatarData } from "@/lib/date";

interface KanbanCardProps {
  card: JobCard;
  index: number;
  onEdit: (card: JobCard) => void;
  onDelete: (id: string) => void;
}

function StatusValidade({ validade }: { validade: string }) {
  if (!validade) return null;

  const hoje = new Date().toISOString().split("T")[0];

  if (validade < hoje) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-medium text-red-400 border border-red-500/20">
        <AlertTriangle className="h-3 w-3" />
        Vencida
      </span>
    );
  }

  if (validade === hoje) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/15 px-2 py-0.5 text-[10px] font-medium text-yellow-400 border border-yellow-500/20">
        <Clock className="h-3 w-3" />
        Vence hoje
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
      <Clock className="h-3 w-3" />
      Vence {formatarData(validade)}
    </span>
  );
}

export function KanbanCard({ card, index, onEdit, onDelete }: KanbanCardProps) {
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
              : card.validade && card.validade < new Date().toISOString().split("T")[0]
                ? "border-red-500/30 hover:border-red-500/50 bg-red-500/[0.02]"
                : "border-white/10 hover:border-white/20"
          }`}
        >
          {/* Validade status */}
          <div className="mb-2">
            <StatusValidade validade={card.validade} />
          </div>

          {/* Título */}
          <h3 className="font-semibold text-sm leading-tight">{card.cargo}</h3>

          {/* Empresa */}
          <p className="mt-0.5 text-xs text-muted-foreground">
            {card.empresa}
          </p>

          {/* Data de candidatura */}
          {card.data && (
            <p className="mt-1 text-[10px] text-muted-foreground/60">
              Candidatura: {formatarData(card.data)}
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

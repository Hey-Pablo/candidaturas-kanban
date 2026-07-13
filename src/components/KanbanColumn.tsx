import type { DroppableProvidedProps } from "@hello-pangea/dnd";
import type { Column, JobCard } from "@/types";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  column: Column;
  cards: JobCard[];
  innerRef: (el: HTMLElement | null) => void;
  droppableProps: DroppableProvidedProps;
  isDraggingOver: boolean;
  onEdit: (card: JobCard) => void;
  onDelete: (id: string) => void;
  children: React.ReactNode;
}

export function KanbanColumn({
  column,
  cards,
  innerRef,
  droppableProps,
  isDraggingOver,
  onEdit,
  onDelete,
  children,
}: KanbanColumnProps) {
  return (
    <div
      className={`flex flex-col rounded-xl border transition-all duration-200 ${
        isDraggingOver
          ? "border-primary/50 bg-primary/5"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{column.icone}</span>
          <h2 className="font-semibold text-sm sm:text-base">
            {column.titulo}
          </h2>
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/10 px-1.5 text-xs font-medium">
            {cards.length}
          </span>
        </div>
      </div>

      {/* Cards container */}
      <div
        ref={innerRef}
        {...droppableProps}
        className="flex flex-col gap-2 p-3 min-h-[120px]"
      >
        {cards.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-white/10 py-8">
            <p className="text-xs text-muted-foreground">
              Arraste cards para cá
            </p>
          </div>
        ) : (
          cards.map((card, index) => (
            <KanbanCard
              key={card.id}
              card={card}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
        {children}
      </div>
    </div>
  );
}

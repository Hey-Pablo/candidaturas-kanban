import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Plus } from "lucide-react";

import { type JobCard, type ColumnId, COLUNAS } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { KanbanColumn } from "./KanbanColumn";
import { CardDialog } from "./CardDialog";
import { ExportButton } from "./ExportButton";

function gerarId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

export function KanbanBoard() {
  const [cards, setCards] = useLocalStorage<JobCard[]>(
    "candidaturas-cards",
    []
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<JobCard | null>(null);

  function getCards(coluna: ColumnId) {
    return cards.filter((c) => c.coluna === coluna);
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;
    const sourceCol = source.droppableId as ColumnId;
    const destCol = destination.droppableId as ColumnId;

    setCards((prev) => {
      const updated = prev.map((card) => {
        if (card.id === draggableId) {
          return { ...card, coluna: destCol };
        }
        return card;
      });
      return updated;
    });
  }

  function handleSave(card: Omit<JobCard, "id">) {
    if (editingCard) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === editingCard.id ? { ...card, id: editingCard.id } : c
        )
      );
    } else {
      setCards((prev) => [...prev, { ...card, id: gerarId() }]);
    }
    setEditingCard(null);
    setDialogOpen(false);
  }

  function handleEdit(card: JobCard) {
    setEditingCard(card);
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
    setDialogOpen(false);
    setEditingCard(null);
  }

  function handleNew() {
    setEditingCard(null);
    setDialogOpen(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              📋 Candidaturas
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton cards={cards} />
            <Button onClick={handleNew} size="sm">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova candidatura</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6">
          {/* Mobile: empilhado, Desktop: grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COLUNAS.map((coluna) => (
              <Droppable droppableId={coluna.id} key={coluna.id}>
                {(provided, snapshot) => (
                  <KanbanColumn
                    column={coluna}
                    cards={getCards(coluna.id)}
                    innerRef={provided.innerRef}
                    droppableProps={provided.droppableProps}
                    isDraggingOver={snapshot.isDraggingOver}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  >
                    {provided.placeholder}
                  </KanbanColumn>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>

      <CardDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingCard(null);
        }}
        card={editingCard}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}

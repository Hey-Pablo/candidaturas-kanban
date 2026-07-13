import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Plus, Database, AlertCircle } from "lucide-react";

import { type JobCard, type ColumnId, COLUNAS } from "@/types";
import { useSupabaseCards } from "@/hooks/useSupabaseCards";
import { Button } from "@/components/ui/button";
import { KanbanColumn } from "./KanbanColumn";
import { CardDialog } from "./CardDialog";
import { ExportButton } from "./ExportButton";

export function KanbanBoard() {
  const {
    cards,
    loading,
    tabelaExiste,
    salvarCard,
    atualizarCard,
    removerCard,
    moverCard,
  } = useSupabaseCards();

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

    if (sourceCol !== destCol) {
      moverCard(draggableId, destCol);
    }
  }

  async function handleSave(card: Omit<JobCard, "id">) {
    if (editingCard) {
      await atualizarCard({ ...card, id: editingCard.id });
    } else {
      await salvarCard(card);
    }
    setEditingCard(null);
    setDialogOpen(false);
  }

  function handleEdit(card: JobCard) {
    setEditingCard(card);
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    await removerCard(id);
    setDialogOpen(false);
    setEditingCard(null);
  }

  function handleNew() {
    setEditingCard(null);
    setDialogOpen(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!tabelaExiste) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center max-w-md space-y-6">
          <div className="mx-auto h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold">Banco de dados não configurado</h2>
          <p className="text-muted-foreground text-sm">
            O Supabase está conectado, mas a tabela <code>cards</code> ainda não
            foi criada. Siga os passos abaixo:
          </p>
          <div className="bg-card border rounded-lg p-4 text-left text-sm space-y-2">
            <p className="font-medium">📋 Passo a passo:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>
                Acesse{" "}
                <a
                  href="https://supabase.com/dashboard/project/pajmbdckrjbfnqcsrszr/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  SQL Editor do Supabase
                </a>
              </li>
              <li>Cole o SQL abaixo e clique em <strong>Run</strong></li>
              <li>Volte aqui e recarregue a página</li>
            </ol>
          </div>
          <div className="bg-card border rounded-lg p-4 text-left">
            <p className="text-xs font-mono text-muted-foreground mb-2">
              SQL para criar a tabela:
            </p>
            <pre className="text-xs font-mono bg-black/20 p-3 rounded overflow-x-auto">
{`CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id TEXT NOT NULL DEFAULT 'default',
  empresa TEXT NOT NULL,
  cargo TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  data TEXT NOT NULL DEFAULT '',
  cor TEXT NOT NULL DEFAULT 'azul',
  notas TEXT NOT NULL DEFAULT '',
  coluna TEXT NOT NULL DEFAULT 'saved',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`}
            </pre>
            <Button
              className="mt-3 w-full"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(
                  `CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id TEXT NOT NULL DEFAULT 'default',
  empresa TEXT NOT NULL,
  cargo TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  data TEXT NOT NULL DEFAULT '',
  cor TEXT NOT NULL DEFAULT 'azul',
  notas TEXT NOT NULL DEFAULT '',
  coluna TEXT NOT NULL DEFAULT 'saved',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`
                );
              }}
            >
              Copiar SQL
            </Button>
          </div>
        </div>
      </div>
    );
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
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
              <Database className="h-3 w-3" />
              Supabase
            </span>
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

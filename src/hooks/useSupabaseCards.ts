import { useState, useEffect, useCallback } from "react";
import { supabase, type SupabaseCard } from "@/lib/supabase";
import type { JobCard, ColumnId } from "@/types";

function gerarBoardId(): string {
  let id = localStorage.getItem("kanban-board-id");
  if (!id) {
    id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 18);
    localStorage.setItem("kanban-board-id", id);
  }
  return id;
}

function toJobCard(row: SupabaseCard): JobCard {
  return {
    id: row.id,
    empresa: row.empresa,
    cargo: row.cargo,
    link: row.link,
    data: row.data,
    cor: row.cor,
    notas: row.notas,
    coluna: row.coluna as ColumnId,
  };
}

export function useSupabaseCards() {
  const [cards, setCards] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabelaExiste, setTabelaExiste] = useState(true);
  const boardId = gerarBoardId();

  const carregarCards = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("board_id", boardId);

      if (error) {
        if (
          error.code === "PGRST205" ||
          error.message?.includes("Could not find the table")
        ) {
          setTabelaExiste(false);
          setCards([]);
          return;
        }
        console.error("Erro ao carregar cards:", error);
        return;
      }

      setTabelaExiste(true);
      setCards((data as SupabaseCard[]).map(toJobCard));
    } catch (err) {
      console.error("Erro ao conectar com Supabase:", err);
      setTabelaExiste(false);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    carregarCards();
  }, [carregarCards]);

  const salvarCard = useCallback(
    async (card: Omit<JobCard, "id">): Promise<string> => {
      const { data, error } = await supabase
        .from("cards")
        .insert({
          board_id: boardId,
          empresa: card.empresa,
          cargo: card.cargo,
          link: card.link,
          data: card.data,
          cor: card.cor,
          notas: card.notas,
          coluna: card.coluna,
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao salvar card:", error);
        throw error;
      }

      const novoCard = toJobCard(data as SupabaseCard);
      setCards((prev) => [...prev, novoCard]);
      return novoCard.id;
    },
    [boardId]
  );

  const atualizarCard = useCallback(
    async (card: JobCard) => {
      const { error } = await supabase
        .from("cards")
        .update({
          empresa: card.empresa,
          cargo: card.cargo,
          link: card.link,
          data: card.data,
          cor: card.cor,
          notas: card.notas,
          coluna: card.coluna,
        })
        .eq("id", card.id)
        .eq("board_id", boardId);

      if (error) {
        console.error("Erro ao atualizar card:", error);
        throw error;
      }

      setCards((prev) => prev.map((c) => (c.id === card.id ? card : c)));
    },
    [boardId]
  );

  const removerCard = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from("cards")
        .delete()
        .eq("id", id)
        .eq("board_id", boardId);

      if (error) {
        console.error("Erro ao remover card:", error);
        throw error;
      }

      setCards((prev) => prev.filter((c) => c.id !== id));
    },
    [boardId]
  );

  const moverCard = useCallback(
    async (id: string, novaColuna: ColumnId) => {
      // Otimista: atualiza local primeiro
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, coluna: novaColuna } : c))
      );

      const { error } = await supabase
        .from("cards")
        .update({ coluna: novaColuna })
        .eq("id", id)
        .eq("board_id", boardId);

      if (error) {
        console.error("Erro ao mover card:", error);
        // Reverte em caso de erro
        carregarCards();
      }
    },
    [boardId, carregarCards]
  );

  return {
    cards,
    loading,
    tabelaExiste,
    salvarCard,
    atualizarCard,
    removerCard,
    moverCard,
    recarregar: carregarCards,
  };
}

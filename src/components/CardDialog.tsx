import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type JobCard, type ColumnId, CORES_ETIQUETA } from "@/types";

interface CardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: JobCard | null;
  onSave: (card: Omit<JobCard, "id">) => void;
  onDelete: (id: string) => void;
}

export function CardDialog({
  open,
  onOpenChange,
  card,
  onSave,
  onDelete,
}: CardDialogProps) {
  const [empresa, setEmpresa] = useState("");
  const [cargo, setCargo] = useState("");
  const [link, setLink] = useState("");
  const [data, setData] = useState("");
  const [cor, setCor] = useState("");
  const [notas, setNotas] = useState("");
  const [coluna, setColuna] = useState<ColumnId>("saved");

  useEffect(() => {
    if (card) {
      setEmpresa(card.empresa);
      setCargo(card.cargo);
      setLink(card.link);
      setData(card.data);
      setCor(card.cor);
      setNotas(card.notas);
      setColuna(card.coluna);
    } else {
      setEmpresa("");
      setCargo("");
      setLink("");
      setData(new Date().toISOString().split("T")[0]);
      setCor("");
      setNotas("");
      setColuna("saved");
    }
  }, [card, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!empresa.trim() || !cargo.trim()) return;

    onSave({
      empresa: empresa.trim(),
      cargo: cargo.trim(),
      link: link.trim(),
      data,
      cor,
      notas: notas.trim(),
      coluna,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {card ? "Editar candidatura" : "Nova candidatura"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa *</Label>
            <Input
              id="empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              placeholder="Nome da empresa"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo *</Label>
            <Input
              id="cargo"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              placeholder="Título da vaga"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link da vaga</Label>
            <Input
              id="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Etiqueta</Label>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(CORES_ETIQUETA).map(([nome, classe]) => (
                  <button
                    key={nome}
                    type="button"
                    onClick={() => setCor(cor === nome ? "" : nome)}
                    className={`h-6 w-6 rounded-full transition-all ${
                      classe
                    } ${
                      cor === nome
                        ? "ring-2 ring-white ring-offset-1 ring-offset-background scale-110"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    title={nome}
                  />
                ))}
                {cor && (
                  <button
                    type="button"
                    onClick={() => setCor("")}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] text-muted-foreground hover:text-foreground"
                    title="Limpar"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coluna">Coluna</Label>
            <select
              id="coluna"
              value={coluna}
              onChange={(e) => setColuna(e.target.value as ColumnId)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="saved">📌 Salvas</option>
              <option value="applied">📝 Inscrições</option>
              <option value="interview">🎯 Entrevista</option>
              <option value="closed">✅ Encerradas</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Observações, detalhes da vaga..."
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            {card && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onDelete(card.id)}
                className="mr-auto"
              >
                Excluir
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              {card ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

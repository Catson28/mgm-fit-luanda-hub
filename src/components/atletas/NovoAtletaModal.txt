"use client"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { X, Upload } from "lucide-react";

interface NovoAtletaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NovoAtletaModal({ isOpen, onClose }: NovoAtletaModalProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [plano, setPlano] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      nome,
      email,
      telefone,
      plano,
      observacoes,
      foto
    });
    // Aqui você implementaria a lógica para salvar o novo atleta

    // Resetar o formulário
    setNome('');
    setEmail('');
    setTelefone('');
    setPlano('');
    setObservacoes('');
    setFoto(null);
    setFotoPreview(null);

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Novo Atleta</DialogTitle>
          <DialogDescription>
            Cadastre um novo atleta no sistema do MGM Fitness
          </DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center border">
                {fotoPreview ? (
                  <img
                    src={fotoPreview}
                    alt="Preview da foto"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor="foto">Foto do atleta</Label>
                <Input
                  id="foto"
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                />
                <p className="text-xs text-muted-foreground">
                  Recomendamos uma foto de rosto clara, formato quadrado, de até 2MB.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do atleta"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email de contato"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="Número de telefone"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="plano">Plano</Label>
                <Select
                  value={plano}
                  onValueChange={setPlano}
                >
                  <SelectTrigger id="plano">
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diario">Diário</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                    <SelectItem value="corporativo">Corporativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações sobre o atleta, objetivos, restrições, etc."
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-mgm-blue hover:bg-mgm-blue-dark">
              Cadastrar Atleta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

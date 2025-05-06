"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { PlusCircle, Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { GalleryForm } from "@/components/gallery/gallery-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from 'next/image';

// Tipos para os dados da galeria
interface Gallery {
  id: string;
  title: string;
  description?: string | null;
  date?: Date | null;
  imageId: string;
  image: { url: string; publicId?: string };
  createdAt: Date;
  updatedAt: Date;
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<Gallery | null>(null);

  const fetchGalleryItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        sortBy,
        sortOrder,
        ...(searchQuery && { search: searchQuery }),
      });
      const response = await fetch(`/api/gallery?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Falha ao carregar galeria");
      }
      const data = await response.json();
      setGalleryItems(data);
    } catch (error) {
      console.error("Erro ao buscar galeria:", error);
      toast.error("Não foi possível carregar a galeria.");
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, sortOrder, searchQuery]);

  // Buscar itens da galeria no carregamento da página
  useEffect(() => {
    fetchGalleryItems();
  }, [fetchGalleryItems]);

  const handleEdit = (galleryItem: Gallery) => {
    setSelectedGalleryItem(galleryItem);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este item da galeria?")) {
      try {
        const response = await fetch(`/api/gallery/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Falha ao excluir item da galeria");
        }

        toast.success("Item da galeria excluído com sucesso.");
        fetchGalleryItems();
      } catch (error) {
        console.error("Erro ao excluir item da galeria:", error);
        toast.error("Não foi possível excluir o item da galeria.");
      }
    }
  };

  const handleFormSubmit = () => {
    setFormOpen(false);
    setSelectedGalleryItem(null);
    fetchGalleryItems();
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleSortBy = (value: "title" | "date") => {
    setSortBy(value);
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Galeria</h1>
            <p className="text-muted-foreground">Gerenciamento de imagens do MGM Fitness</p>
          </div>
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-mgm-blue hover:bg-mgm-blue-dark">
                <PlusCircle className="mr-2 h-4 w-4" /> Novo Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedGalleryItem ? "Editar Item da Galeria" : "Novo Item da Galeria"}
                </DialogTitle>
              </DialogHeader>
              <GalleryForm galleryItem={selectedGalleryItem} onSuccess={handleFormSubmit} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchGalleryItems();
              }}
              className="relative flex-1"
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </form>
            <div className="flex gap-2 flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-2">
                    Ordenar por: {sortBy === "title" ? "Título" : "Data"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleSortBy("title")}>
                    Título
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortBy("date")}>
                    Data
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortOrder}
                className="h-10 w-10"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-4 w-[200px] mb-2" />
                <Skeleton className="h-4 w-[150px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {galleryItems.length === 0 ? (
            <div className="text-center p-8 col-span-full">
              <p className="text-lg font-medium">Nenhum item na galeria encontrado</p>
              <p className="text-muted-foreground">
                Tente ajustar a busca ou adicione um novo item.
              </p>
            </div>
          ) : (
            galleryItems.map((item) => (
              <Card key={item.id} className="overflow-hidden group hover:shadow-md transition-all duration-200">
              {/* Imagem com overlay de botões ao passar o mouse */}
              <div className="aspect-video relative overflow-hidden">
                <Image fill 
                  src={item.image.url}
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Overlay com botões de ação que aparecem ao passar o mouse */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-mgm-blue hover:bg-mgm-blue hover:text-white"
                    onClick={() => handleEdit(item)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-red-600 hover:bg-red-600 hover:text-white"
                    onClick={() => handleDelete(item.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
              
              {/* Conteúdo do card */}
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1 line-clamp-1">{item.title}</h3>
                
                <div className="space-y-2">
                  {/* Descrição com número limitado de linhas */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description || "-"}
                  </p>
                  
                  {/* Data formatada com ícone */}
                  {item.date && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {format(new Date(item.date), "dd MMM yyyy", { locale: ptBR })}
                    </div>
                  )}
                </div>
              </div>
            </Card>
            ))
          )}
        </div>
      )}
    </Layout>
  );
}
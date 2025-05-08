"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { PlusCircle, Search, SlidersHorizontal, ArrowUpDown, LayoutList, LayoutGrid } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AthleteForm } from "@/components/athletes/athlete-form";
import { AthleteFilters } from "@/components/athletes/athlete-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { AthleteStatus } from "@prisma/client";

// Tipos para os dados do atleta
interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
}

export interface AthleteProps {
  id: string;
  name: string;
  initials?: string | null;
  phone?: string | null;
  membershipStart?: Date | null;
  status: AthleteStatus;
  planId?: string | null;
  plan?: Plan | null;
  imageUrl?: string | null;
  createdAt: Date;
}

export default function AthletesPage() {
  const router = useRouter();
  const [athletes, setAthletes] = useState<AthleteProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFilters, setOpenFilters] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteProps | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    status: "",
    plan: "",
    startDate: "",
    endDate: "",
  });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const fetchAthletes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/athletes?sortOrder=${sortOrder}`);
      if (!response.ok) {
        throw new Error("Falha ao carregar atletas");
      }
      const data = await response.json();
      setAthletes(data);
    } catch (error) {
      console.error("Erro ao buscar atletas:", error);
      toast.error("Não foi possível carregar os atletas.");
    } finally {
      setIsLoading(false);
    }
  }, [sortOrder]);

  // Buscar atletas no carregamento da página
  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  const handleEdit = (athlete: AthleteProps) => {
    setSelectedAthlete(athlete);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este atleta?")) {
      try {
        const response = await fetch(`/api/athletes/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Falha ao excluir atleta");
        }

        toast.success("Atleta excluído com sucesso.");
        fetchAthletes();
      } catch (error) {
        console.error("Erro ao excluir atleta:", error);
        toast.error("Não foi possível excluir o atleta.");
      }
    }
  };

  const handleFormSubmit = () => {
    setFormOpen(false);
    setSelectedAthlete(null);
    fetchAthletes();
  };

  const handleStatusToggle = async (id: string, currentStatus: AthleteStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const response = await fetch(`/api/athletes/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar status");
      }

      toast.success(`Atleta ${newStatus === "ACTIVE" ? "ativado" : "desativado"} com sucesso.`);
      fetchAthletes();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Não foi possível atualizar o status do atleta.");
    }
  };

  const applyFilters = (filters: unknown) => {
    setFilterOptions(filters);
    setOpenFilters(false);
    fetchFilteredAthletes(filters);
  };

  const fetchFilteredAthletes = async (filters: unknown) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.plan) queryParams.append("planId", filters.plan);
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);
      if (searchQuery) queryParams.append("search", searchQuery);
      queryParams.append("sortOrder", sortOrder);

      const response = await fetch(`/api/athletes?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Falha ao buscar atletas filtrados");
      }
      const data = await response.json();
      setAthletes(data);
    } catch (error) {
      console.error("Erro ao filtrar atletas:", error);
      toast.error("Não foi possível filtrar os atletas.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredAthletes(filterOptions);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "list" ? "grid" : "list"));
  };

  const getStatusBadge = (status: AthleteStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Ativo
          </Badge>
        );
      case "INACTIVE":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-green-100">
            Inativo
          </Badge>
        );
      case "SUSPENDED":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Suspenso
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanBadge = (planName?: string) => {
    if (!planName) return <Badge className="bg-gray-500">Sem plano</Badge>;
    if (planName.includes("Anual")) return <Badge className="bg-mgm-blue">Anual</Badge>;
    if (planName.includes("Mensal")) return <Badge className="bg-green-500">Mensal</Badge>;
    if (planName.includes("Semanal")) return <Badge className="bg-yellow-500">Semanal</Badge>;
    return <Badge className="bg-gray-500">{planName}</Badge>;
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Atletas</h1>
            <p className="text-muted-foreground">Gerenciamento de membros do MGM Fitness</p>
          </div>
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-mgm-blue hover:bg-mgm-blue-dark">
                <PlusCircle className="mr-2 h-4 w-4" /> Novo Atleta
              </Button>
            </DialogTrigger>
            <DialogContent className="h-full w-full max-h-full overflow-y-auto sm:max-w-xl sm:h-auto sm:max-h-[90vh] p-4 flex flex-col">
              <DialogHeader>
                <DialogTitle>{selectedAthlete ? "Editar Atleta" : "Novo Atleta"}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto">
                <AthleteForm athlete={selectedAthlete} onSuccess={handleFormSubmit} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, telefone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </form>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortOrder}
                className="h-10 w-10"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
              <Sheet open={openFilters} onOpenChange={setOpenFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtros Avançados</SheetTitle>
                    <SheetDescription>
                      Configure os filtros para encontrar atletas específicos
                    </SheetDescription>
                  </SheetHeader>
                  <AthleteFilters
                    currentFilters={filterOptions}
                    onApplyFilters={applyFilters}
                  />
                </SheetContent>
              </Sheet>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleViewMode}
                className="h-10 w-10"
                title={viewMode === "list" ? "Mudar para vista em grelha" : "Mudar para vista em lista"}
              >
                {viewMode === "list" ? (
                  <LayoutGrid className="h-4 w-4" />
                ) : (
                  <LayoutList className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className={viewMode === "list" ? "grid gap-4" : "grid gap-4 sm:grid-cols-2 md:grid-cols-3"}>
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              {viewMode === "list" ? (
                <CardContent className="p-6 flex items-center">
                  <Skeleton className="h-16 w-16 rounded-full mr-4" />
                  <div className="grid md:grid-cols-5 flex-1 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </CardContent>
              ) : (
                <div className="flex flex-col">
                  <Skeleton className="h-40 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-[200px] mb-2" />
                    <Skeleton className="h-4 w-[150px] mb-2" />
                    <Skeleton className="h-4 w-[100px]" />
                  </CardContent>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className={viewMode === "list" ? "grid gap-4" : "grid gap-4 sm:grid-cols-2 md:grid-cols-3"}>
          {athletes.length === 0 ? (
            <div className="text-center p-8 col-span-full">
              <p className="text-lg font-medium">Nenhum atleta encontrado</p>
              <p className="text-muted-foreground">
                Tente ajustar os filtros de busca ou adicione um novo atleta.
              </p>
            </div>
          ) : (
            athletes.map((athlete) => (
              <Card
                key={athlete.id}
                className={`overflow-hidden ${viewMode === "grid" ? "flex flex-col hover:shadow-lg transition-shadow" : ""}`}
              >
                {viewMode === "list" ? (
                  <CardContent className="p-0">
                    <div className="flex items-center p-6">
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage src={athlete.imageUrl || ""} />
                        <AvatarFallback className="bg-mgm-blue text-white text-xl">
                          {athlete.initials || athlete.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid md:grid-cols-5 flex-1 gap-4">
                        <div className="space-y-1 md:col-span-2">
                          <p className="font-medium text-lg">{athlete.name}</p>
                          <p className="text-sm text-muted-foreground">{athlete.phone || "-"}</p>
                          <p className="text-xs">
                            Membro desde:{" "}
                            {athlete.membershipStart
                              ? format(new Date(athlete.membershipStart), "dd MMM yyyy", {
                                  locale: ptBR,
                                })
                              : "-"}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {getPlanBadge(athlete.plan?.name)}
                        </div>
                        <div className="flex items-center">
                          {getStatusBadge(athlete.status)}
                        </div>
                        <div className="flex justify-end items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/atletas/${athlete.id}`)}
                          >
                            Perfil
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-mgm-blue/10 text-mgm-blue border-mgm-blue/20"
                            onClick={() => handleEdit(athlete)}
                          >
                            Editar
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Mais
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleStatusToggle(athlete.id, athlete.status)}
                              >
                                {athlete.status === "ACTIVE" ? "Desativar" : "Ativar"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(athlete.id)}
                              >
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                ) : (
                  <>
                    <div className="relative aspect-square">
                      <Avatar className="absolute inset-0 h-full w-full">
                        <AvatarImage
                          src={athlete.imageUrl || ""}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-mgm-blue text-white text-4xl">
                          {athlete.initials || athlete.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{athlete.name}</CardTitle>
                        <Badge className="bg-mgm-blue text-white">
                          {athlete.membershipStart
                            ? format(new Date(athlete.membershipStart), "dd MMM yyyy", {
                                locale: ptBR,
                              })
                            : "-"}
                        </Badge>
                      </div>
                      <CardDescription>{athlete.phone || "-"}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="flex gap-2 mb-4">
                        {getPlanBadge(athlete.plan?.name)}
                        {getStatusBadge(athlete.status)}
                      </div>
                      <div className="flex items-center justify-between mt-auto gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/atletas/${athlete.id}`)}
                        >
                          Perfil
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-mgm-blue/10 text-mgm-blue border-mgm-blue/20"
                            onClick={() => handleEdit(athlete)}
                          >
                            Editar
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Mais
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleStatusToggle(athlete.id, athlete.status)}
                              >
                                {athlete.status === "ACTIVE" ? "Desativar" : "Ativar"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(athlete.id)}
                              >
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </Layout>
  );
}
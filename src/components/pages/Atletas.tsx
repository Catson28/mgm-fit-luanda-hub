"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { PlusCircle, Search, SlidersHorizontal, ArrowUpDown, LayoutList, LayoutGrid, MoreHorizontal, Phone, Calendar, CheckCircle, XCircle } from "lucide-react";
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
  SheetFooter,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AthleteForm } from "@/components/athletes/athlete-form";
import { AthleteFilters } from "@/components/athletes/athlete-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { AthleteStatus } from "@prisma/client";
// import { useMediaQuery } from "@/hooks/use-media-query";

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

// Interface para os filtros
interface FilterOptions {
  status: string;
  plan: string;
  startDate: string;
  endDate: string;
}

// Hook para detectar tamanho da tela
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

export default function AthletesPage() {
  const router = useRouter();
  const [athletes, setAthletes] = useState<AthleteProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFilters, setOpenFilters] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteProps | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: "",
    plan: "",
    startDate: "",
    endDate: "",
  });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);

  // Verificar se é dispositivo móvel
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  // Manter a preferência do usuário para o modo de visualização
  // Não forçamos "list" em mobile, apenas melhoramos a experiência

  const handleEdit = (athlete: AthleteProps) => {
    setSelectedAthlete(athlete);
    setFormOpen(true);
    setMobileMenuOpen(null); // Fechar menu móvel ao editar
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
        setMobileMenuOpen(null); // Fechar menu móvel após exclusão
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
      setMobileMenuOpen(null); // Fechar menu móvel após atualização
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Não foi possível atualizar o status do atleta.");
    }
  };

  const applyFilters = (filters: FilterOptions) => {
    setFilterOptions(filters);
    setOpenFilters(false);
    fetchFilteredAthletes(filters);
  };

  const fetchFilteredAthletes = async (filters: FilterOptions) => {
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

  const toggleMobileMenu = (id: string) => {
    setMobileMenuOpen(mobileMenuOpen === id ? null : id);
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
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
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
      <div className="mb-4 px-2 sm:px-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold">Atletas</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Gerenciamento de membros do MGM Fitness</p>
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

      <Card className="mb-4 mx-2 sm:mx-0">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, telefone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </form>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortOrder}
                className="h-10 w-10"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
              {/* Filtros como Sheet (melhor para mobile) */}
              <Sheet open={openFilters} onOpenChange={setOpenFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[80vh]" : ""}>
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
                  <SheetFooter className="mt-4">
                    <Button onClick={() => setOpenFilters(false)}>Cancelar</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
              {/* Manter a opção de alternar entre Grid e List para todos dispositivos */}
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
        <div className={viewMode === "list" ? "grid gap-2 px-2 sm:px-0" : "grid gap-4 sm:grid-cols-2 md:grid-cols-3 px-2 sm:px-0"}>
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              {viewMode === "list" ? (
                <CardContent className="p-4 flex items-center">
                  <Skeleton className="h-12 w-12 rounded-full mr-3" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-[140px] mb-2" />
                    <Skeleton className="h-3 w-[100px]" />
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
        <div className={viewMode === "list" ? "grid gap-2 px-2 sm:px-0" : "grid gap-4 sm:grid-cols-2 md:grid-cols-3 px-2 sm:px-0"}>
          {athletes.length === 0 ? (
            <div className="text-center p-8 col-span-full">
              <p className="text-lg font-medium">Nenhum atleta encontrado</p>
              <p className="text-sm text-muted-foreground">
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
                    <div className="relative flex items-center p-3">
                      <Avatar className="h-12 w-12 mr-3 flex-shrink-0">
                        <AvatarImage src={athlete.imageUrl || ""} />
                        <AvatarFallback className="bg-mgm-blue text-white">
                          {athlete.initials || athlete.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-base truncate">{athlete.name}</h3>
                          {athlete.status === "ACTIVE" ? (
                            <Badge className="bg-green-500 text-white ml-2">Ativo</Badge>
                          ) : (
                            <Badge className="bg-red-500 text-white ml-2">Inativo</Badge>
                          )}
                        </div>
                        <div className="flex flex-col mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            <span className="truncate">{athlete.phone || "-"}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {athlete.membershipStart
                                ? format(new Date(athlete.membershipStart), "dd MMM yyyy", {
                                  locale: ptBR,
                                })
                                : "-"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="px-2 py-1 h-8 text-xs"
                            onClick={() => router.push(`/atletas/${athlete.id}`)}
                          >
                            Perfil
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="px-2 py-1 h-8 text-xs bg-mgm-blue/10 text-mgm-blue border-mgm-blue/20"
                            onClick={() => handleEdit(athlete)}
                          >
                            Editar
                          </Button>
                          <Sheet
                            open={mobileMenuOpen === athlete.id}
                            onOpenChange={(open) => !open && setMobileMenuOpen(null)}
                          >
                            <SheetTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="px-2 h-8 ml-auto"
                                onClick={() => toggleMobileMenu(athlete.id)}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-auto max-h-[40vh]">
                              <div className="py-4 flex flex-col gap-2">
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => router.push(`/atletas/${athlete.id}`)}
                                >
                                  Ver perfil completo
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start bg-mgm-blue/10 text-mgm-blue border-mgm-blue/20"
                                  onClick={() => handleEdit(athlete)}
                                >
                                  Editar informações
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => handleStatusToggle(athlete.id, athlete.status)}
                                >
                                  {athlete.status === "ACTIVE" ? (
                                    <>
                                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                      Desativar atleta
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                      Ativar atleta
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="w-full justify-start mt-2"
                                  onClick={() => handleDelete(athlete.id)}
                                >
                                  Excluir atleta
                                </Button>
                              </div>
                              <SheetFooter>
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => setMobileMenuOpen(null)}
                                >
                                  Cancelar
                                </Button>
                              </SheetFooter>
                            </SheetContent>
                          </Sheet>
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
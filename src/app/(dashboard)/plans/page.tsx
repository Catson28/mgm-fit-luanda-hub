"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { PlusCircle, Search, ArrowUpDown, LayoutList, LayoutGrid, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { PlanForm } from "@/components/plans/plan-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Tipos para os dados do plano
interface PlanFeature {
  id: string;
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description?: string | null;
  isPopular: boolean;
  status: "ACTIVE" | "INACTIVE";
  features: PlanFeature[];
  createdAt: Date;
  updatedAt: Date;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  // ... outros estados ...
  const [isHandlingFocus, setIsHandlingFocus] = useState(false);

  // Handler seguro para eventos de foco
  const handleSafeFocus = useCallback((e: React.FocusEvent) => {
    if (isHandlingFocus) return;

    setIsHandlingFocus(true);
    console.log('Focus event on:', e.target);

    // Adicione aqui qualquer lógica necessária
    // que não cause redirecionamento de foco

    setTimeout(() => {
      setIsHandlingFocus(false);
    }, 100);
  }, [isHandlingFocus]);

  // Monitoramento de eventos de foco (para diagnóstico)
  useEffect(() => {
    const logFocusEvent = (e: Event) => {
      console.log(`Focus ${e.type} on:`, e.target);
    };

    window.addEventListener('focusin', logFocusEvent);
    window.addEventListener('focusout', logFocusEvent);

    return () => {
      window.removeEventListener('focusin', logFocusEvent);
      window.removeEventListener('focusout', logFocusEvent);
    };
  }, []);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        sortBy,
        sortOrder,
        ...(searchQuery && { search: searchQuery }),
      });
      const response = await fetch(`/api/plans?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Falha ao carregar planos");
      }
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      toast.error("Não foi possível carregar os planos.");
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, sortOrder, searchQuery]);

  // Buscar planos no carregamento da página
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este plano?")) {
      try {
        const response = await fetch(`/api/plans/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Falha ao excluir plano");
        }

        toast.success("Plano excluído com sucesso.");
        fetchPlans();
      } catch (error) {
        console.error("Erro ao excluir plano:", error);
        toast.error("Não foi possível excluir o plano.");
      }
    }
  };

  const handleFormSubmit = () => {
    setFormOpen(false);
    setSelectedPlan(null);
    fetchPlans();
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleSortBy = (value: "name" | "price") => {
    setSortBy(value);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "list" ? "grid" : "list"));
  };

  const getStatusBadge = (status: "ACTIVE" | "INACTIVE") => {
    return status === "ACTIVE" ? (
      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
        Ativo
      </Badge>
    ) : (
      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
        Inativo
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Planos</h1>
            <p className="text-muted-foreground">Gerenciamento de planos do MGM Fitness</p>
          </div>
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-mgm-blue hover:bg-mgm-blue-dark">
                <PlusCircle className="mr-2 h-4 w-4" /> Novo Plano
              </Button>
            </DialogTrigger>
            <DialogContent
              onOpenAutoFocus={(e) => {
                e.preventDefault();
                handleSafeFocus(e);
              }}
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                handleSafeFocus(e);
              }}
              className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>{selectedPlan ? "Editar Plano" : "Novo Plano"}</DialogTitle>
              </DialogHeader>
              <PlanForm plan={selectedPlan} onSuccess={handleFormSubmit} />
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
                fetchPlans();
              }}
              className="relative flex-1"
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                onFocus={handleSafeFocus}
                onBlur={handleSafeFocus}
                placeholder="Buscar por nome do plano..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </form>
            <div className="flex gap-2 flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-2">
                    Ordenar por: {sortBy === "name" ? "Nome" : "Preço"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleSortBy("name")}>
                    Nome
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortBy("price")}>
                    Preço
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
        <div className={viewMode === "list" ? "grid gap-4" : "grid gap-4 sm:grid-cols-3 md:grid-cols-4"}>
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              {viewMode === "list" ? (
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-5 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[200px]" />
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
                  <CardHeader>
                    <Skeleton className="h-6 w-[150px] mb-2" />
                    <Skeleton className="h-4 w-[200px]" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-[100px] mb-2" />
                    <Skeleton className="h-4 w-[150px]" />
                  </CardContent>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className={viewMode === "list" ? "grid gap-4" : "grid gap-4 sm:grid-cols-3 md:grid-cols-4"}>
          {plans.length === 0 ? (
            <div className="text-center p-8 col-span-full">
              <p className="text-lg font-medium">Nenhum plano encontrado</p>
              <p className="text-muted-foreground">
                Tente ajustar a busca ou adicione um novo plano.
              </p>
            </div>
          ) : (
            plans.map((plan) => (
              <Card
                key={plan.id}
                className={`overflow-hidden ${viewMode === "grid" && plan.isPopular ? "border-mgm-blue" : ""} ${viewMode === "grid" ? "flex flex-col hover:shadow-lg transition-shadow" : ""}`}
              >
                {viewMode === "list" ? (
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-5 gap-4">
                      <div className="space-y-1 md:col-span-2">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-lg">{plan.name}</p>
                          {plan.isPopular && (
                            <Badge className="bg-mgm-blue">Popular</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{plan.description || "-"}</p>
                        <p className="text-xs">
                          Criado em:{" "}
                          {format(new Date(plan.createdAt), "dd MMM yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="font-medium">
                          {plan.price.toLocaleString("pt-AO", {
                            style: "currency",
                            currency: "AOA",
                          })}{" "}
                          / {plan.period}
                        </p>
                      </div>
                      <div className="flex items-center">{getStatusBadge(plan.status)}</div>
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-mgm-blue/10 text-mgm-blue border-mgm-blue/20"
                          onClick={() => handleEdit(plan)}
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
                              className="text-red-600"
                              onClick={() => handleDelete(plan.id)}
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {plan.features.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium">Funcionalidades:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {plan.features.map((feature) => (
                            <Badge
                              key={feature.id}
                              variant={feature.included ? "default" : "secondary"}
                              className={
                                feature.included ? "bg-mgm-blue" : "bg-gray-200 text-gray-800"
                              }
                            >
                              {feature.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                ) : (
                  <>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        {plan.isPopular && (
                          <Badge className="bg-mgm-blue">Mais Popular</Badge>
                        )}
                      </div>
                      <CardDescription>{plan.description || "-"}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="mb-4">
                        <p className="text-2xl font-bold">
                          {plan.price.toLocaleString("pt-AO", {
                            style: "currency",
                            currency: "AOA",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">{plan.period}</p>
                      </div>
                      {plan.features.length > 0 && (
                        <ul className="space-y-2">
                          {plan.features.map((feature) => (
                            <li key={feature.id} className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-mgm-blue mt-0.5" />
                              <span>{feature.name}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <div className="flex gap-2 self-start">
                        {getStatusBadge(plan.status)}
                        <Badge className="bg-gray-200 text-gray-800">
                          Criado: {format(new Date(plan.createdAt), "dd MMM yyyy", { locale: ptBR })}
                        </Badge>
                      </div>
                      <div className="flex gap-2 w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-mgm-blue/10 text-mgm-blue border-mgm-blue/20"
                          onClick={() => handleEdit(plan)}
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
                              className="text-red-600"
                              onClick={() => handleDelete(plan.id)}
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardFooter>
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
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { PlusCircle, Search, ArrowUpDown, LayoutList, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import { EventForm } from "@/components/events/event-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Tipos para os dados do evento
interface Athlete {
  id: string;
  name: string;
  initials?: string | null;
}

interface EventRegistration {
  id: string;
  athleteId: string;
  athlete: Athlete;
  registeredAt: Date;
}

interface Event {
  id: string;
  title: string;
  description?: string | null;
  date: Date;
  location?: string | null;
  status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  imageId?: string | null;
  image?: { url: string } | null;
  registrations: EventRegistration[];
  createdAt: Date;
  updatedAt: Date;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  // Buscar eventos no carregamento da página
  useEffect(() => {
    fetchEvents();
  }, [sortBy, sortOrder, searchQuery]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        sortBy,
        sortOrder,
        ...(searchQuery && { search: searchQuery }),
      });
      const response = await fetch(`/api/events?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Falha ao carregar eventos");
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      toast.error("Não foi possível carregar os eventos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este evento?")) {
      try {
        const response = await fetch(`/api/events/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Falha ao excluir evento");
        }

        toast.success("Evento excluído com sucesso.");
        fetchEvents();
      } catch (error) {
        console.error("Erro ao excluir evento:", error);
        toast.error("Não foi possível excluir o evento.");
      }
    }
  };

  const handleFormSubmit = () => {
    setFormOpen(false);
    setSelectedEvent(null);
    fetchEvents();
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleSortBy = (value: "title" | "date") => {
    setSortBy(value);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "list" ? "grid" : "list"));
  };

  const getStatusBadge = (status: Event["status"]) => {
    switch (status) {
      case "SCHEDULED":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Agendado
          </Badge>
        );
      case "ONGOING":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Em Andamento
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Concluído
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelado
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Eventos</h1>
            <p className="text-muted-foreground">Gerenciamento de eventos do MGM Fitness</p>
          </div>
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-mgm-blue hover:bg-mgm-blue-dark">
                <PlusCircle className="mr-2 h-4 w-4" /> Novo Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>{selectedEvent ? "Editar Evento" : "Novo Evento"}</DialogTitle>
              </DialogHeader>
              <EventForm event={selectedEvent} onSuccess={handleFormSubmit} />
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
                fetchEvents();
              }}
              className="relative flex-1"
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título do evento..."
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
          {events.length === 0 ? (
            <div className="text-center p-8 col-span-full">
              <p className="text-lg font-medium">Nenhum evento encontrado</p>
              <p className="text-muted-foreground">
                Tente ajustar a busca ou adicione um novo evento.
              </p>
            </div>
          ) : (
            events.map((event) => (
              <Card
                key={event.id}
                className={`overflow-hidden ${viewMode === "grid" ? "flex flex-col hover:shadow-lg transition-shadow" : ""}`}
              >
                {viewMode === "list" ? (
                  <CardContent className="p-0">
                    <div className="flex items-center p-6">
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage src={event.image?.url || ""} />
                        <AvatarFallback className="bg-mgm-blue text-white text-xl">
                          {event.title.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid md:grid-cols-5 flex-1 gap-4">
                        <div className="space-y-1 md:col-span-2">
                          <p className="font-medium text-lg">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.location || "-"} |{" "}
                            {format(new Date(event.date), "dd MMM yyyy HH:mm", {
                              locale: ptBR,
                            })}
                          </p>
                          <p className="text-xs">
                            {event.registrations.length} atleta(s) registrado(s)
                          </p>
                        </div>
                        <div className="flex items-center">
                          {getStatusBadge(event.status)}
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm">{event.description || "-"}</p>
                        </div>
                        <div className="flex justify-end items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-mgm-blue/10 text-mgm-blue border-mgm-blue/20"
                            onClick={() => handleEdit(event)}
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
                                onClick={() => handleDelete(event.id)}
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
                    <div className="relative aspect-video">
                      <img
                        src={event.image?.url || "/placeholder.png"}
                        alt={event.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge className="bg-mgm-blue text-white">
                          {format(new Date(event.date), "dd MMM yyyy", { locale: ptBR })}
                        </Badge>
                      </div>
                      <CardDescription>{event.location || "-"}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground mb-4 flex-1">
                        {event.description || "-"}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 text-sm">
                          <span>{event.registrations.length} atleta(s)</span>
                          <span>{getStatusBadge(event.status)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-mgm-blue/10 text-mgm-blue border-mgm-blue/20"
                            onClick={() => handleEdit(event)}
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
                                onClick={() => handleDelete(event.id)}
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
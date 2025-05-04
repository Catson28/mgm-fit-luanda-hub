"use client"
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Users } from 'lucide-react';
import { NovoEventoModal } from '@/components/eventos/NovoEventoModal';

const Eventos = () => {
  const [isNovoEventoModalOpen, setIsNovoEventoModalOpen] = useState(false);

  const eventos = [
    {
      id: 1,
      titulo: "Campeonato de Fisiculturismo",
      descricao: "Competição regional com atletas de toda Angola",
      data: "15 Jun 2025",
      local: "MGM Fitness Arena",
      inscritos: 45,
      imagem: "https://images.unsplash.com/photo-1605296867724-fa87a8ef53fd"
    },
    {
      id: 2,
      titulo: "Workshop de Nutrição Esportiva",
      descricao: "Aprenda sobre alimentação para performance máxima",
      data: "22 Mai 2025",
      local: "Sala de Conferências MGM",
      inscritos: 28,
      imagem: "https://images.unsplash.com/photo-1490645935967-10de6ba17061"
    },
    {
      id: 3,
      titulo: "Desafio de Funcional",
      descricao: "Teste seus limites neste desafio de resistência",
      data: "10 Mai 2025",
      local: "Área Externa MGM",
      inscritos: 32,
      imagem: "https://images.unsplash.com/photo-1519311965067-36d3e5f33d39"
    },
    {
      id: 4,
      titulo: "Aula Especial de Zumba",
      descricao: "Comemore o aniversário do MGM com uma super aula",
      data: "05 Mai 2025",
      local: "Salão Principal",
      inscritos: 50,
      imagem: "https://images.unsplash.com/photo-1518611012118-696072aa579a"
    },
    {
      id: 5,
      titulo: "Palestra: Prevenção de Lesões",
      descricao: "Como treinar de forma segura e eficiente",
      data: "28 Abr 2025",
      local: "Auditório MGM",
      inscritos: 20,
      imagem: "https://images.unsplash.com/photo-1576678927484-cc907957088c"
    }
  ];

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Eventos</h1>
            <p className="text-muted-foreground">
              Gerenciamento de eventos do MGM Fitness
            </p>
          </div>
          <Button
            className="bg-mgm-blue hover:bg-mgm-blue-dark"
            onClick={() => setIsNovoEventoModalOpen(true)}
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Novo Evento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventos.map((evento) => (
          <Card key={evento.id} className="overflow-hidden flex flex-col">
            <div className="aspect-video relative">
              <img
                src={evento.imagem}
                alt={evento.titulo}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{evento.titulo}</CardTitle>
                <div className="bg-mgm-blue/10 text-mgm-blue rounded-full px-3 py-1 text-xs">
                  {evento.data}
                </div>
              </div>
              <CardDescription>{evento.local}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground mb-4">{evento.descricao}</p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-mgm-red" />
                  <span>{evento.inscritos} inscritos</span>
                </div>
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <NovoEventoModal
        isOpen={isNovoEventoModalOpen}
        onClose={() => setIsNovoEventoModalOpen(false)}
      />
    </Layout>
  );
};

export default Eventos;

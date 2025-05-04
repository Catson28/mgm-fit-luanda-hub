"use client"
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Users } from 'lucide-react';
import { NovoEventoModal } from '@/components/eventos/NovoEventoModal';

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  image?: { url: string };
  registrations: { athlete: { id: string } }[];
}

const Eventos: React.FC = () => {
  const [isNovoEventoModalOpen, setIsNovoEventoModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/events', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch events');
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleCreateEvent = async (eventData: Partial<Event>) => {
    try {
      const token = localStorage.getItem('token');
      const createRes = await fetch('/api/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!createRes.ok) throw new Error('Failed to create event');

      setIsNovoEventoModalOpen(false);

      const fetchRes = await fetch('/api/events', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!fetchRes.ok) throw new Error('Failed to fetch events');

      const data: Event[] = await fetchRes.json();
      setEvents(data);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

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

      {loading ? (
        <div className="text-center p-8">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evento) => (
            <Card key={evento.id} className="overflow-hidden flex flex-col">
              <div className="aspect-video relative">
                <img
                  src={evento.image?.url}
                  alt={evento.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{evento.title}</CardTitle>
                  <div className="bg-mgm-blue/10 text-mgm-blue rounded-full px-3 py-1 text-xs">
                    {new Date(evento.date).toLocaleDateString()}
                  </div>
                </div>
                <CardDescription>{evento.location}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground mb-4">{evento.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-mgm-red" />
                    <span>{evento.registrations.length} inscritos</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <NovoEventoModal
        isOpen={isNovoEventoModalOpen}
        onClose={() => setIsNovoEventoModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
    </Layout>
  );
};

export default Eventos;
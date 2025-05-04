
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Calendar, Users, MapPin, Clock 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants?: number;
}

const events: Event[] = [
  {
    id: 1,
    title: 'Desafio Fitness MGM',
    date: '15 de Maio, 2025',
    time: '09:00 - 12:00',
    location: 'MGM Ginásio Principal',
    participants: 18,
    maxParticipants: 25
  },
  {
    id: 2,
    title: 'Aula de Yoga ao ar livre',
    date: '22 de Maio, 2025',
    time: '07:30 - 08:30',
    location: 'Parque da Samba',
    participants: 12,
    maxParticipants: 20
  },
  {
    id: 3,
    title: 'Workshop de Nutrição Esportiva',
    date: '30 de Maio, 2025',
    time: '18:00 - 20:00',
    location: 'MGM Sala de Conferências',
    participants: 30,
    maxParticipants: 40
  }
];

export function UpcomingEvents() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Próximos Eventos
            </CardTitle>
            <CardDescription>Eventos agendados para este mês</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Ver Todos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="border-b border-border pb-4 last:pb-0 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{event.title}</h4>
                <Badge 
                  variant="outline" 
                  className="text-mgm-blue border-mgm-blue/20 bg-mgm-blue/10"
                >
                  {event.date}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <Users className="h-4 w-4" />
                  <div className="flex items-center">
                    <span>
                      {event.participants} 
                      {event.maxParticipants && (
                        <> de {event.maxParticipants}</>
                      )} participantes
                    </span>
                    {event.maxParticipants && (
                      <div className="ml-2 bg-muted h-2 w-24 rounded-full overflow-hidden">
                        <div 
                          className="bg-mgm-blue h-full rounded-full"
                          style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Ver Detalhes
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

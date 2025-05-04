
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ActivityItem {
  id: number;
  user: {
    name: string;
    image?: string;
    initials: string;
  };
  action: string;
  time: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

const recentActivities: ActivityItem[] = [
  {
    id: 1,
    user: {
      name: 'Carlos Mendes',
      initials: 'CM'
    },
    action: 'registrou entrada no ginásio',
    time: 'Agora mesmo',
    status: 'success'
  },
  {
    id: 2,
    user: {
      name: 'Maria Santos',
      initials: 'MS'
    },
    action: 'renovou plano mensal',
    time: '35 minutos atrás',
    status: 'info'
  },
  {
    id: 3,
    user: {
      name: 'João Paulo',
      initials: 'JP'
    },
    action: 'inscreveu-se no evento Desafio Fitness',
    time: '2 horas atrás',
    status: 'info'
  },
  {
    id: 4,
    user: {
      name: 'Ana Silva',
      initials: 'AS'
    },
    action: 'atualizou foto de perfil',
    time: '4 horas atrás'
  },
  {
    id: 5,
    user: {
      name: 'Pedro Costa',
      initials: 'PC'
    },
    action: 'plano expirado',
    time: '1 dia atrás',
    status: 'warning'
  }
];

const statusColors = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-mgm-red',
  info: 'bg-mgm-blue'
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>Últimas 5 atividades no ginásio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center gap-4 text-sm"
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={activity.user.image} />
                  <AvatarFallback className="bg-mgm-blue/10 text-mgm-blue">
                    {activity.user.initials}
                  </AvatarFallback>
                </Avatar>
                {activity.status && (
                  <span 
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${statusColors[activity.status]}`}
                  />
                )}
              </div>
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {activity.user.name}{' '}
                    <span className="font-normal text-muted-foreground">
                      {activity.action}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
                {activity.status === 'warning' && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600/20 bg-yellow-50">
                    Atenção
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

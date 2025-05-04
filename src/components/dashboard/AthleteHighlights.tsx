
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Award, ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function AthleteHighlights() {
  const featuredAthlete = {
    name: 'Ricardo Fernandes',
    initials: 'RF',
    image: undefined,
    title: 'Atleta do Mês',
    achievement: 'Perda de 12kg em 3 meses',
    plan: 'Plano Anual Premium'
  };
  
  const recentTransformations = [
    {
      id: 1,
      name: 'Joana Silva',
      initials: 'JS',
      achievement: 'Ganho muscular significativo',
      days: 90,
      image: undefined
    },
    {
      id: 2,
      name: 'Miguel Costa',
      initials: 'MC',
      achievement: 'Redução de 8% de gordura corporal',
      days: 60,
      image: undefined
    }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-mgm-red" /> Destaques
        </CardTitle>
        <CardDescription>Atletas em destaque este mês</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={featuredAthlete.image} />
              <AvatarFallback className="bg-mgm-red/10 text-mgm-red text-xl">
                {featuredAthlete.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <Badge className="mb-2 bg-mgm-red">
                {featuredAthlete.title}
              </Badge>
              <h4 className="font-medium text-lg">{featuredAthlete.name}</h4>
              <p className="text-sm text-muted-foreground">{featuredAthlete.achievement}</p>
              <p className="text-xs font-medium text-mgm-blue mt-1">{featuredAthlete.plan}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            Ver Perfil
          </Button>
        </div>

        <h4 className="font-medium text-sm mb-3">Transformações Recentes</h4>
        <div className="space-y-3">
          {recentTransformations.map((athlete) => (
            <div 
              key={athlete.id} 
              className="flex items-center gap-3 group"
            >
              <Avatar>
                <AvatarImage src={athlete.image} />
                <AvatarFallback className="bg-mgm-blue/10 text-mgm-blue">
                  {athlete.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{athlete.name}</p>
                <p className="text-xs text-muted-foreground">{athlete.achievement}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {athlete.days} dias
              </Badge>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


import { Layout } from '@/components/layout/Layout';
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, 
  BreadcrumbList, BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Check, Plus } from 'lucide-react';

const Planos = () => {
  const plans = [
    {
      id: 1,
      name: 'Diário',
      price: '1.500 Kz',
      period: 'Por dia',
      description: 'Acesso por um dia inteiro às instalações',
      features: [
        'Acesso à sala de musculação',
        'Acesso à área de cardio',
        'Uso dos vestiários',
      ],
      color: 'bg-slate-100',
      popular: false
    },
    {
      id: 2,
      name: 'Semanal',
      price: '7.500 Kz',
      period: 'Por semana',
      description: 'Acesso completo por 7 dias consecutivos',
      features: [
        'Acesso à sala de musculação',
        'Acesso à área de cardio',
        'Aulas coletivas (sujeito à disponibilidade)',
        'Uso dos vestiários',
      ],
      color: 'bg-slate-100',
      popular: false
    },
    {
      id: 3,
      name: 'Mensal',
      price: '25.000 Kz',
      period: 'Por mês',
      description: 'Plano completo com benefícios adicionais',
      features: [
        'Acesso ilimitado às instalações',
        'Todas as aulas coletivas',
        'Avaliação física inicial',
        'Plano de treino personalizado',
      ],
      color: 'bg-mgm-blue text-white',
      popular: true
    },
    {
      id: 4,
      name: 'Anual',
      price: '240.000 Kz',
      period: 'Por ano',
      description: 'Melhor custo-benefício para atletas regulares',
      features: [
        'Todos os benefícios do plano mensal',
        'Desconto de 20% sobre o valor mensal',
        'Avaliações físicas trimestrais',
        'Plano alimentar básico',
        'Um treino com personal trainer por mês'
      ],
      color: 'bg-slate-100',
      popular: false
    },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Planos</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Planos de Treino</h1>
            <p className="text-muted-foreground">
              Gerencie os planos disponíveis no MGM Fitness Luanda
            </p>
          </div>
          <Button className="bg-mgm-blue hover:bg-mgm-blue-dark">
            <Plus className="mr-2 h-4 w-4" /> Novo Plano
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`${plan.color} border-2 ${plan.popular ? 'border-mgm-red shadow-lg' : 'border-transparent'}`}>
            <CardHeader>
              {plan.popular && <Badge className="bg-mgm-red mb-2 self-start">Mais Popular</Badge>}
              <CardTitle className="flex items-center gap-2">
                <DollarSign className={`h-5 w-5 ${plan.popular ? 'text-white' : 'text-mgm-blue'}`} />
                {plan.name}
              </CardTitle>
              <CardDescription className={plan.popular ? 'text-white/80' : ''}>
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className={`text-3xl font-bold mb-1 ${plan.popular ? 'text-white' : ''}`}>{plan.price}</p>
                <p className={`text-sm ${plan.popular ? 'text-white/80' : 'text-muted-foreground'}`}>{plan.period}</p>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className={`h-5 w-5 mt-0.5 ${plan.popular ? 'text-white' : 'text-mgm-blue'}`} />
                    <span className={plan.popular ? 'text-white' : ''}>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={plan.popular ? "outline" : "default"} 
                className={`w-full ${plan.popular ? 'border-white text-white hover:bg-white hover:text-mgm-blue' : 'bg-mgm-blue hover:bg-mgm-blue-dark'}`}
              >
                Gerenciar Plano
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default Planos;

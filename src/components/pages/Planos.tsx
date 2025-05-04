"use client"
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Check, Plus } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description?: string;
  isPopular: boolean;
  features: { id: string; name: string; included: boolean }[];
}

const Planos: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/plans', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch plans');
        const data: Plan[] = await response.json();
        setPlans(data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

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

      {loading ? (
        <div className="text-center p-8">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`${plan.isPopular ? 'bg-mgm-blue text-white' : 'bg-slate-100'} border-2 ${plan.isPopular ? 'border-mgm-red shadow-lg' : 'border-transparent'}`}>
              <CardHeader>
                {plan.isPopular && <Badge className="bg-mgm-red mb-2 self-start">Mais Popular</Badge>}
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className={`h-5 w-5 ${plan.isPopular ? 'text-white' : 'text-mgm-blue'}`} />
                  {plan.name}
                </CardTitle>
                <CardDescription className={plan.isPopular ? 'text-white/80' : ''}>
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className={`text-3xl font-bold mb-1 ${plan.isPopular ? 'text-white' : ''}`}>{plan.price} Kz</p>
                  <p className={`text-sm ${plan.isPopular ? 'text-white/80' : 'text-muted-foreground'}`}>{plan.period}</p>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature.id} className="flex items-start gap-2">
                      <Check className={`h-5 w-5 mt-0.5 ${plan.isPopular ? 'text-white' : 'text-mgm-blue'}`} />
                      <span className={plan.isPopular ? 'text-white' : ''}>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={plan.isPopular ? "outline" : "default"}
                  className={`w-full ${plan.isPopular ? 'border-white text-white hover:bg-white hover:text-mgm-blue' : 'bg-mgm-blue hover:bg-mgm-blue-dark'}`}
                >
                  Gerenciar Plano
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Planos;
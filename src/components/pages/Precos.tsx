"use client"
import { useState, useEffect } from 'react';
import { WebsiteLayout } from '@/components/layout/WebsiteLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description?: string;
  isPopular: boolean;
  features: { id: string; name: string; included: boolean }[];
}

interface CorporatePlan {
  id: string;
  name: string;
  description?: string;
  discount: number;
  minEmployees: number;
  maxEmployees?: number;
}

const Precos: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [corporatePlans, setCorporatePlans] = useState<CorporatePlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [plansRes, corporatePlansRes] = await Promise.all([
          fetch('/api/plans', {
            headers: { 'Content-Type': 'application/json' },
          }),
          fetch('/api/corporate-plans', {
            headers: { 'Content-Type': 'application/json' },
          }),
        ]);

        if (!plansRes.ok) throw new Error('Failed to fetch plans');
        if (!corporatePlansRes.ok) throw new Error('Failed to fetch corporate plans');

        const plansData: Plan[] = await plansRes.json();
        const corporatePlansData: CorporatePlan[] = await corporatePlansRes.json();

        setPlans(plansData);
        setCorporatePlans(corporatePlansData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <WebsiteLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">Planos e Preços</h1>
            <p className="text-muted-foreground mt-2">
              Escolha o plano que melhor atende às suas necessidades
            </p>
          </div>

          {loading ? (
            <div className="text-center p-8">Carregando...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {plans.map((plano) => (
                  <Card
                    key={plano.id}
                    className={`flex flex-col ${plano.isPopular ? 'border-mgm-blue shadow-lg shadow-mgm-blue/20 relative' : ''}`}
                  >
                    {plano.isPopular && (
                      <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-3 py-1 bg-mgm-blue text-white text-sm rounded-full">
                        Mais Popular
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-center text-2xl">{plano.name}</CardTitle>
                      <CardDescription className="text-center">{plano.description}</CardDescription>
                      <div className="text-center mt-4">
                        <span className="text-3xl font-bold">
                          {plano.price} <span className="text-base font-normal text-muted-foreground">Kz</span>
                        </span>
                        <p className="text-sm text-muted-foreground">{plano.period}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-2 mb-6">
                        {plano.features.map((feature) => (
                          <li key={feature.id} className="flex items-center gap-2">
                            {feature.included ? (
                              <CheckCircle2 className="text-green-500 h-5 w-5" />
                            ) : (
                              <XCircle className="text-gray-300 h-5 w-5" />
                            )}
                            <span className={feature.included ? '' : 'text-muted-foreground'}>
                              {feature.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className={`w-full ${plano.isPopular ? 'bg-mgm-blue hover:bg-mgm-blue-dark' : ''}`}
                        variant={plano.isPopular ? 'default' : 'outline'}
                      >
                        Começar Agora
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <Card className="bg-mgm-blue/5 border-mgm-blue/20">
                <CardHeader>
                  <CardTitle>Planos Empresariais</CardTitle>
                  <CardDescription>
                    Oferecemos condições especiais para empresas que desejam proporcionar bem-estar para seus colaboradores
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Entre em contacto com nossa equipe comercial para conhecer os pacotes empresariais
                    personalizados de acordo com o número de funcionários e necessidades específicas da sua empresa.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {corporatePlans.map((plan) => (
                      <div key={plan.id} className="bg-white p-4 rounded-lg border">
                        <h3 className="font-bold mb-2">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {plan.description} | {plan.discount}% de desconto
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Solicitar Proposta Empresarial</Button>
                </CardFooter>
              </Card>

              <div className="bg-mgm-red text-white p-8 rounded-lg">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">Dúvidas sobre nossos planos?</h2>
                  <p className="mt-2">
                    Nossa equipe está pronta para lhe ajudar a escolher o plano mais adequado às suas necessidades
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button variant="outline" className="bg-transparent border-white hover:bg-white hover:text-mgm-red">
                    Agendar Visita
                  </Button>
                  <Button className="bg-white text-mgm-red hover:bg-gray-100">
                    Fale Conosco
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default Precos;
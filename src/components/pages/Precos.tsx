
import { WebsiteLayout } from '@/components/layout/WebsiteLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from 'lucide-react';

const Precos = () => {
  const planos = [
    {
      nome: "Diário",
      preco: "1.500",
      periodo: "por dia",
      descricao: "Acesso completo por um dia",
      destaque: false,
      recursos: [
        { nome: "Acesso a todas as áreas", incluido: true },
        { nome: "Acompanhamento de personal", incluido: false },
        { nome: "Avaliação física", incluido: false },
        { nome: "Plano nutricional", incluido: false },
        { nome: "Participação em aulas", incluido: true }
      ]
    },
    {
      nome: "Semanal",
      preco: "7.000",
      periodo: "por semana",
      descricao: "Ideal para visitantes temporários",
      destaque: false,
      recursos: [
        { nome: "Acesso a todas as áreas", incluido: true },
        { nome: "Acompanhamento de personal", incluido: false },
        { nome: "Avaliação física", incluido: false },
        { nome: "Plano nutricional", incluido: false },
        { nome: "Participação em aulas", incluido: true }
      ]
    },
    {
      nome: "Mensal",
      preco: "25.000",
      periodo: "por mês",
      descricao: "O plano mais popular",
      destaque: true,
      recursos: [
        { nome: "Acesso a todas as áreas", incluido: true },
        { nome: "Acompanhamento de personal", incluido: true },
        { nome: "Avaliação física", incluido: true },
        { nome: "Plano nutricional", incluido: false },
        { nome: "Participação em aulas", incluido: true }
      ]
    },
    {
      nome: "Anual",
      preco: "250.000",
      periodo: "por ano",
      descricao: "Melhor relação custo-benefício",
      destaque: false,
      recursos: [
        { nome: "Acesso a todas as áreas", incluido: true },
        { nome: "Acompanhamento de personal", incluido: true },
        { nome: "Avaliação física", incluido: true },
        { nome: "Plano nutricional", incluido: true },
        { nome: "Participação em aulas", incluido: true }
      ]
    }
  ];

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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {planos.map((plano) => (
              <Card 
                key={plano.nome} 
                className={`flex flex-col ${plano.destaque ? 'border-mgm-blue shadow-lg shadow-mgm-blue/20 relative' : ''}`}
              >
                {plano.destaque && (
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-3 py-1 bg-mgm-blue text-white text-sm rounded-full">
                    Mais Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-center text-2xl">{plano.nome}</CardTitle>
                  <CardDescription className="text-center">{plano.descricao}</CardDescription>
                  <div className="text-center mt-4">
                    <span className="text-3xl font-bold">
                      {plano.preco} <span className="text-base font-normal text-muted-foreground">Kz</span>
                    </span>
                    <p className="text-sm text-muted-foreground">{plano.periodo}</p>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 mb-6">
                    {plano.recursos.map((recurso) => (
                      <li key={recurso.nome} className="flex items-center gap-2">
                        {recurso.incluido ? (
                          <CheckCircle2 className="text-green-500 h-5 w-5" />
                        ) : (
                          <XCircle className="text-gray-300 h-5 w-5" />
                        )}
                        <span className={recurso.incluido ? '' : 'text-muted-foreground'}>
                          {recurso.nome}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${plano.destaque ? 'bg-mgm-blue hover:bg-mgm-blue-dark' : ''}`}
                    variant={plano.destaque ? 'default' : 'outline'}
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
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-bold mb-2">Plano Corporativo Básico</h3>
                  <p className="text-sm text-muted-foreground">
                    De 5 a 15 funcionários | 20% de desconto
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-bold mb-2">Plano Corporativo Intermédio</h3>
                  <p className="text-sm text-muted-foreground">
                    De 16 a 30 funcionários | 30% de desconto
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-bold mb-2">Plano Corporativo Avançado</h3>
                  <p className="text-sm text-muted-foreground">
                    Mais de 30 funcionários | 40% de desconto
                  </p>
                </div>
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
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default Precos;

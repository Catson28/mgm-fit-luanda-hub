
import { WebsiteLayout } from '@/components/layout/WebsiteLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const Funcionalidades = () => {
  const categorias = [
    {
      titulo: "Gestão de Atletas",
      descricao: "Ferramentas completas para gerenciar informações dos atletas",
      funcionalidades: [
        "Cadastro com foto, dados pessoais e plano",
        "Divisão entre atletas internos (mensal/anuais) e externos (diários/semanais)",
        "Histórico detalhado de pagamentos e frequência",
        "Fichas de acompanhamento físico",
        "Visualização de evolução com gráficos",
        "Notificações automáticas para atletas"
      ]
    },
    {
      titulo: "Acompanhamento Físico",
      descricao: "Monitoramento completo do progresso dos atletas",
      funcionalidades: [
        "Registro de peso, IMC e medidas corporais",
        "Armazenamento de fotos antes e depois",
        "Gráficos de evolução personalizados",
        "Metas de treino e condicionamento",
        "Integração com dispositivos wearable",
        "Relatórios periódicos de progresso"
      ]
    },
    {
      titulo: "Planos e Pagamentos",
      descricao: "Gestão completa de planos e controle financeiro",
      funcionalidades: [
        "Opções de plano: diário, semanal, mensal, anual",
        "Gestão de pagamentos e recibos digitais",
        "Controle de status de validade dos planos",
        "Renovações automáticas e descontos",
        "Notificações de expiração e renovação",
        "Relatórios financeiros detalhados"
      ]
    },
    {
      titulo: "Eventos e Destaques",
      descricao: "Promoção e gestão de eventos do ginásio",
      funcionalidades: [
        "Calendário completo de eventos",
        "Inscrições online para competições",
        "Publicação de atleta do mês",
        "Galeria de transformações",
        "Compartilhamento em redes sociais",
        "Notificações push para novos eventos"
      ]
    }
  ];

  return (
    <WebsiteLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">Funcionalidades</h1>
            <p className="text-muted-foreground mt-2">
              Conheça todas as ferramentas disponíveis no MGM Fitness
            </p>
          </div>

          {/* Banner de destaques */}
          <div className="p-6 bg-mgm-blue text-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Sistema Integrado de Gestão</h2>
            <p className="mb-6">
              O MGM Fitness oferece um sistema completo que integra gestão de atletas, 
              acompanhamento físico, controle financeiro e promoção de eventos em uma única plataforma.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-mgm-red h-5 w-5" />
                <span>Interface intuitiva</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-mgm-red h-5 w-5" />
                <span>Acesso via web e mobile</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-mgm-red h-5 w-5" />
                <span>Dados em tempo real</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-mgm-red h-5 w-5" />
                <span>Relatórios detalhados</span>
              </div>
            </div>
          </div>

          {/* Lista de categorias e funcionalidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categorias.map((categoria) => (
              <Card key={categoria.titulo} className="overflow-hidden">
                <CardHeader className="bg-mgm-blue/10">
                  <CardTitle>{categoria.titulo}</CardTitle>
                  <CardDescription>{categoria.descricao}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {categoria.funcionalidades.map((funcionalidade) => (
                      <li key={funcionalidade} className="flex items-start gap-2">
                        <CheckCircle2 className="text-mgm-blue h-5 w-5 mt-0.5 shrink-0" />
                        <span>{funcionalidade}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Seção de integração */}
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>
                O sistema do MGM Fitness se integra com diversas plataformas para melhorar a experiência
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center p-4 rounded-lg border">
                  <Image fill  
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png" 
                    alt="Facebook" 
                    className="h-12 mb-4" 
                  />
                  <p className="text-sm text-center">Compartilhamento automático de conquistas</p>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg border">
                  <Image fill  
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png" 
                    alt="Instagram" 
                    className="h-12 mb-4" 
                  />
                  <p className="text-sm text-center">Publicação de eventos e resultados</p>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg border">
                  <Image fill  
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Fitbit_Logo_2021.svg/2560px-Fitbit_Logo_2021.svg.png" 
                    alt="Fitbit" 
                    className="h-12 mb-4" 
                  />
                  <p className="text-sm text-center">Integração com dados de atividade</p>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg border">
                  <Image fill  
                    src="https://logodownload.org/wp-content/uploads/2016/10/WhatsApp-logo.png" 
                    alt="WhatsApp" 
                    className="h-12 mb-4" 
                  />
                  <p className="text-sm text-center">Notificações e comunicados automáticos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default Funcionalidades;

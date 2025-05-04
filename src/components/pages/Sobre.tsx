
import { WebsiteLayout } from '@/components/layout/WebsiteLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Sobre = () => {
  const equipe = [
    {
      nome: "João Silva",
      cargo: "Fundador e Diretor",
      foto: undefined,
      iniciais: "JS",
      bio: "Personal trainer certificado com mais de 15 anos de experiência no mercado fitness."
    },
    {
      nome: "Maria Santos",
      cargo: "Nutricionista",
      foto: undefined,
      iniciais: "MS",
      bio: "Especialista em nutrição esportiva, ajuda nossos atletas a alcançarem seus objetivos através da alimentação adequada."
    },
    {
      nome: "Pedro Costa",
      cargo: "Head Coach",
      foto: undefined,
      iniciais: "PC",
      bio: "Especializado em treinamento funcional e hipertrofia, lidera nossa equipe de treinadores."
    },
    {
      nome: "Ana Oliveira",
      cargo: "Fisioterapeuta",
      foto: undefined,
      iniciais: "AO",
      bio: "Especializada em reabilitação esportiva, oferece suporte para a recuperação e prevenção de lesões."
    }
  ];

  return (
    <WebsiteLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">Sobre o MGM Fitness</h1>
            <p className="text-muted-foreground mt-2">
              Conheça nossa história, valores e equipe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Nossa História</h2>
              <div className="space-y-4">
                <p>
                  Fundado em 2018, o MGM Fitness nasceu da paixão de João Silva pelo fitness e 
                  seu desejo de criar um espaço de treinamento de qualidade em Luanda. Inicialmente 
                  uma pequena academia com equipamentos básicos, hoje nos orgulhamos de ser uma 
                  referência no sector fitness em Angola.
                </p>
                <p>
                  Ao longo dos anos, expandimos nossas instalações, investimos em equipamentos 
                  modernos e montamos uma equipe de profissionais altamente qualificados. Nossa 
                  missão sempre foi proporcionar um ambiente acolhedor onde pessoas de todas as 
                  idades e níveis de condicionamento físico possam alcançar seus objetivos de saúde e bem-estar.
                </p>
                <p>
                  Em 2022, inauguramos nossa nova sede na Samba, em frente à Trirumo, com 
                  1.200m² de área dedicada à prática esportiva, consolidando nossa posição como 
                  um dos principais centros de fitness da capital angolana.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f"
                alt="MGM Fitness Luanda"
                className="rounded-lg shadow-lg max-h-80 object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Nossos Valores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="bg-mgm-blue/5">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-mgm-blue">Excelência</h3>
                  <p className="text-sm">
                    Buscamos a excelência em todos os aspectos do nosso trabalho, desde o atendimento 
                    até a qualidade dos equipamentos e programas de treinamento.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-mgm-blue/5">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-mgm-blue">Inclusão</h3>
                  <p className="text-sm">
                    Acreditamos que o fitness deve ser acessível a todos, independentemente da idade, 
                    do condicionamento físico ou da experiência prévia.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-mgm-blue/5">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-mgm-blue">Comunidade</h3>
                  <p className="text-sm">
                    Fomentamos um senso de comunidade e pertencimento, onde nossos membros se 
                    apoiam mutuamente na jornada de transformação.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-mgm-blue/5">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-mgm-blue">Inovação</h3>
                  <p className="text-sm">
                    Estamos sempre à procura de novas técnicas, equipamentos e métodos para 
                    melhorar a experiência dos nossos atletas.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-mgm-blue/5">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-mgm-blue">Saúde Integral</h3>
                  <p className="text-sm">
                    Acreditamos em uma abordagem holística à saúde, integrando treino físico, 
                    nutrição adequada e bem-estar mental.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-mgm-blue/5">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-mgm-blue">Responsabilidade</h3>
                  <p className="text-sm">
                    Assumimos a responsabilidade pelo desenvolvimento e segurança dos nossos 
                    atletas, garantindo um ambiente seguro e orientação profissional.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Nossa Equipa</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {equipe.map((membro) => (
                <div key={membro.nome} className="flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={membro.foto} />
                    <AvatarFallback className="bg-mgm-blue text-white text-2xl">
                      {membro.iniciais}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg">{membro.nome}</h3>
                  <p className="text-sm text-mgm-red mb-2">{membro.cargo}</p>
                  <p className="text-sm text-muted-foreground">{membro.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default Sobre;

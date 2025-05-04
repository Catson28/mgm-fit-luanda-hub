
import { WebsiteLayout } from '@/components/layout/WebsiteLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NewspaperIcon } from 'lucide-react';

const Blog = () => {
  const categorias = ["Todos", "Treino", "Nutrição", "Bem-estar", "Eventos"];
  const artigos = [
    {
      id: 1,
      titulo: "Como otimizar seus ganhos musculares",
      categoria: "Treino",
      imagem: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e",
      resumo: "Descubra as melhores técnicas e estratégias para maximizar seus resultados na musculação.",
      data: "25 Abr 2025",
      autor: {
        nome: "Pedro Costa",
        avatar: undefined,
        iniciais: "PC"
      }
    },
    {
      id: 2,
      titulo: "Alimentação para ganho de massa muscular",
      categoria: "Nutrição",
      imagem: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
      resumo: "Conheça os alimentos essenciais para quem busca hipertrofia e como incorporá-los na dieta.",
      data: "18 Abr 2025",
      autor: {
        nome: "Maria Santos",
        avatar: undefined,
        iniciais: "MS"
      }
    },
    {
      id: 3,
      titulo: "Benefícios do treino funcional",
      categoria: "Treino",
      imagem: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
      resumo: "Entenda como o treinamento funcional pode melhorar sua qualidade de vida e performance atlética.",
      data: "10 Abr 2025",
      autor: {
        nome: "João Silva",
        avatar: undefined,
        iniciais: "JS"
      }
    },
    {
      id: 4,
      titulo: "Mindfulness e treino: como a mente influencia seus resultados",
      categoria: "Bem-estar",
      imagem: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
      resumo: "A conexão mente-corpo e como a meditação e mindfulness podem potencializar seu treino.",
      data: "05 Abr 2025",
      autor: {
        nome: "Ana Oliveira",
        avatar: undefined,
        iniciais: "AO"
      }
    },
    {
      id: 5,
      titulo: "Próxima competição de fisiculturismo em Luanda",
      categoria: "Eventos",
      imagem: "https://images.unsplash.com/photo-1605296867724-fa87a8ef53fd",
      resumo: "Saiba tudo sobre o próximo campeonato que acontecerá em nossa cidade.",
      data: "01 Abr 2025",
      autor: {
        nome: "Pedro Costa",
        avatar: undefined,
        iniciais: "PC"
      }
    },
    {
      id: 6,
      titulo: "Como recuperar-se adequadamente após treinos intensos",
      categoria: "Bem-estar",
      imagem: "https://images.unsplash.com/photo-1517130038641-a774d04afb3c",
      resumo: "Métodos eficazes de recuperação para evitar lesões e melhorar seus resultados.",
      data: "28 Mar 2025",
      autor: {
        nome: "Ana Oliveira",
        avatar: undefined,
        iniciais: "AO"
      }
    }
  ];

  return (
    <WebsiteLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <NewspaperIcon className="h-8 w-8 text-mgm-red" />
              <div>
                <h1 className="font-heading text-3xl font-bold">Blog MGM Fitness</h1>
                <p className="text-muted-foreground">
                  Dicas, novidades e conhecimento sobre fitness e bem-estar
                </p>
              </div>
            </div>
            <Button className="bg-mgm-blue hover:bg-mgm-blue-dark">
              Assinar Newsletter
            </Button>
          </div>

          {/* Categorias */}
          <div className="flex flex-wrap gap-2">
            {categorias.map((categoria) => (
              <Button 
                key={categoria} 
                variant={categoria === "Todos" ? "default" : "outline"}
                className={categoria === "Todos" ? "bg-mgm-blue hover:bg-mgm-blue-dark" : ""}
              >
                {categoria}
              </Button>
            ))}
          </div>

          {/* Artigo em destaque */}
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-video overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
                  alt="Treinamento de alta intensidade" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col p-6">
                <div className="bg-mgm-red/10 text-mgm-red text-xs rounded-full px-3 py-1 w-fit mb-4">
                  Em Destaque
                </div>
                <h2 className="text-2xl font-bold mb-4">Treinamento de alta intensidade: benefícios e riscos</h2>
                <p className="text-muted-foreground mb-6">
                  Uma análise completa sobre os treinos HIIT, seus benefícios para o condicionamento, 
                  queima de gordura e os cuidados necessários para evitar lesões.
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <Avatar>
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="bg-mgm-blue text-white">
                      JS
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">João Silva</p>
                    <p className="text-xs text-muted-foreground">30 Abr 2025</p>
                  </div>
                </div>
                <Button className="mt-6 bg-mgm-blue hover:bg-mgm-blue-dark">
                  Ler artigo completo
                </Button>
              </div>
            </div>
          </Card>

          {/* Lista de artigos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artigos.map((artigo) => (
              <Card key={artigo.id} className="flex flex-col overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={artigo.imagem} 
                    alt={artigo.titulo}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-mgm-blue/10 text-mgm-blue text-xs rounded-full px-3 py-1">
                      {artigo.categoria}
                    </div>
                    <span className="text-xs text-muted-foreground">{artigo.data}</span>
                  </div>
                  <CardTitle className="text-lg">{artigo.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm">
                    {artigo.resumo}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={artigo.autor.avatar} />
                      <AvatarFallback className="bg-mgm-blue/10 text-mgm-blue text-xs">
                        {artigo.autor.iniciais}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{artigo.autor.nome}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ler mais
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="outline" className="min-w-[200px]">
              Carregar mais artigos
            </Button>
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default Blog;

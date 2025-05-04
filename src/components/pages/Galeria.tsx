
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Galeria = () => {
  const images = [
    {
      id: 1,
      title: 'Competição 2025',
      description: 'Imagens da competição de culturismo',
      url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
      date: '15/03/2025'
    },
    {
      id: 2,
      title: 'Treino em equipa',
      description: 'Sessão de treino funcional em grupo',
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      date: '03/02/2025'
    },
    {
      id: 3,
      title: 'Workshop de nutrição',
      description: 'Palestra sobre nutrição esportiva',
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      date: '20/01/2025'
    },
    {
      id: 4,
      title: 'Inauguração área funcional',
      description: 'Nova área de treino funcional',
      url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
      date: '05/01/2025'
    },
    {
      id: 5,
      title: 'Desafio de fim de ano',
      description: 'Atletas no desafio de dezembro',
      url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
      date: '28/12/2024'
    },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Galeria</h1>
            <p className="text-muted-foreground">
              Momentos especiais do MGM Fitness Luanda
            </p>
          </div>
          <Button className="bg-mgm-blue hover:bg-mgm-blue-dark">
            <Image className="mr-2 h-4 w-4" />
            Adicionar Imagem
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden group">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={image.url} 
                alt={image.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{image.title}</CardTitle>
              <CardDescription>{image.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{image.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default Galeria;

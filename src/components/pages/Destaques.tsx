'use client'
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { 
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, 
  BreadcrumbList, BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter
} from '@/components/ui/card';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, Calendar, Plus, Search, Star } from 'lucide-react';

const Destaques = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const monthlyHighlights = [
    {
      id: 1,
      name: 'Ricardo Fernandes',
      initials: 'RF',
      image: undefined,
      month: 'Abril 2025',
      achievement: 'Perda de 12kg em 3 meses',
      bio: 'Ricardo transformou completamente sua saúde com dedicação extrema aos treinos e alimentação. Frequenta o ginásio 6 vezes por semana e segue o plano alimentar à risca.',
      plan: 'Plano Anual Premium'
    },
    {
      id: 2,
      name: 'Ana Luísa',
      initials: 'AL',
      image: undefined,
      month: 'Março 2025',
      achievement: 'Ganho de massa muscular',
      bio: 'Ana superou seus limites e conseguiu aumentar significativamente sua massa muscular, transformando sua confiança e bem-estar.',
      plan: 'Plano Mensal'
    },
    {
      id: 3,
      name: 'João Miguel',
      initials: 'JM',
      image: undefined,
      month: 'Fevereiro 2025',
      achievement: 'Definição muscular impressionante',
      bio: 'João conseguiu uma definição muscular excepcional para participar de um evento esportivo, demonstrando grande disciplina.',
      plan: 'Plano Anual'
    },
  ];

  const transformations = [
    {
      id: 1,
      name: 'Joana Silva',
      initials: 'JS',
      image: undefined,
      achievement: 'Perda de 15kg',
      duration: '4 meses',
      description: 'Transformação focada em perda de peso e tonificação muscular através de treino HIIT e musculação.'
    },
    {
      id: 2,
      name: 'Miguel Costa',
      initials: 'MC',
      image: undefined,
      achievement: 'Ganho de 8kg de massa muscular',
      duration: '6 meses',
      description: 'Foco em hipertrofia com treinamento de força progressivo e acompanhamento nutricional.'
    },
    {
      id: 3,
      name: 'Carolina Dias',
      initials: 'CD',
      image: undefined,
      achievement: 'Redução de 12% de gordura corporal',
      duration: '3 meses',
      description: 'Combinação de treino aeróbico, musculação e reeducação alimentar completa.'
    },
    {
      id: 4,
      name: 'André Martins',
      initials: 'AM',
      image: undefined,
      achievement: 'Recuperação pós-lesão',
      duration: '5 meses',
      description: 'Trabalho de fisioterapia e fortalecimento muscular após lesão no joelho.'
    },
  ];
  
  const filteredHighlights = monthlyHighlights.filter(highlight => 
    highlight.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    highlight.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
    highlight.achievement.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredTransformations = transformations.filter(transformation => 
    transformation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transformation.achievement.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <BreadcrumbLink>Destaques</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Destaques</h1>
            <p className="text-muted-foreground">
              Atletas em destaque e transformações impressionantes
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Pesquisar destaques..."
                className="pl-8 w-full md:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-mgm-blue hover:bg-mgm-blue-dark">
              <Plus className="mr-2 h-4 w-4" /> Novo Destaque
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="atletas">
        <TabsList className="mb-6">
          <TabsTrigger value="atletas">
            <Award className="mr-2 h-4 w-4" />
            Atletas do Mês
          </TabsTrigger>
          <TabsTrigger value="transformacoes">
            <Star className="mr-2 h-4 w-4" />
            Transformações
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="atletas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHighlights.map((athlete) => (
              <Card key={athlete.id} className="overflow-hidden border-2 hover:border-mgm-blue transition-colors">
                <CardHeader className="bg-mgm-blue text-white pb-2">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-mgm-red mb-2">{athlete.month}</Badge>
                    <Star className="h-5 w-5 text-yellow-300" fill="currentColor" />
                  </div>
                  <CardTitle className="text-xl">{athlete.name}</CardTitle>
                  <CardDescription className="text-white/80">{athlete.achievement}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={athlete.image} />
                      <AvatarFallback className="text-xl bg-mgm-blue/10 text-mgm-blue">
                        {athlete.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-muted-foreground">{athlete.plan}</p>
                    </div>
                  </div>
                  <p className="text-sm">{athlete.bio}</p>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">Ver Perfil Completo</Button>
                </CardFooter>
              </Card>
            ))}
            {filteredHighlights.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Nenhum destaque encontrado para sua pesquisa.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="transformacoes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTransformations.map((transformation) => (
              <Card key={transformation.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{transformation.name}</CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {transformation.duration}
                    </Badge>
                  </div>
                  <CardDescription>{transformation.achievement}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={transformation.image} />
                      <AvatarFallback className="text-xl bg-mgm-red/10 text-mgm-red">
                        {transformation.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">{transformation.description}</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 mt-4">
                    <h4 className="font-medium mb-2 text-sm">Antes e Depois</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                        <p className="text-xs text-muted-foreground">Foto Antes</p>
                      </div>
                      <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                        <p className="text-xs text-muted-foreground">Foto Depois</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">Ver Detalhes</Button>
                </CardFooter>
              </Card>
            ))}
            {filteredTransformations.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Nenhuma transformação encontrada para sua pesquisa.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Destaques;

"use client"
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown, UserPlus } from 'lucide-react';
import { NovoAtletaModal } from '@/components/atletas/NovoAtletaModal';

const Atletas = () => {
  const [isNovoAtletaModalOpen, setIsNovoAtletaModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filtroPlano, setFiltroPlano] = useState<string | null>(null);

  const atletas = [
    {
      id: 1,
      nome: "Ricardo Fernandes",
      iniciais: "RF",
      imagem: undefined,
      plano: "Anual Premium",
      desde: "12 Jan 2023",
      telefone: "+244 923 456 789",
      status: "Ativo"
    },
    {
      id: 2,
      nome: "Joana Silva",
      iniciais: "JS",
      imagem: undefined,
      plano: "Mensal",
      desde: "05 Mar 2024",
      telefone: "+244 912 345 678",
      status: "Ativo"
    },
    {
      id: 3,
      nome: "Miguel Costa",
      iniciais: "MC",
      imagem: undefined,
      plano: "Mensal",
      desde: "22 Fev 2024",
      telefone: "+244 934 567 890",
      status: "Ativo"
    },
    {
      id: 4,
      nome: "Carla Sousa",
      iniciais: "CS",
      imagem: undefined,
      plano: "Semanal",
      desde: "15 Abr 2025",
      telefone: "+244 956 789 012",
      status: "Ativo"
    },
    {
      id: 5,
      nome: "Paulo Mendes",
      iniciais: "PM",
      imagem: undefined,
      plano: "Anual",
      desde: "08 Jun 2023",
      telefone: "+244 945 678 901",
      status: "Inativo"
    },
    {
      id: 6,
      nome: "Sofia Andrade",
      iniciais: "SA",
      imagem: undefined,
      plano: "Mensal",
      desde: "01 Jan 2025",
      telefone: "+244 967 890 123",
      status: "Ativo"
    },
    {
      id: 7,
      nome: "Luís Castro",
      iniciais: "LC",
      imagem: undefined,
      plano: "Diário",
      desde: "28 Abr 2025",
      telefone: "+244 978 901 234",
      status: "Ativo"
    },
    {
      id: 8,
      nome: "Ana Duarte",
      iniciais: "AD",
      imagem: undefined,
      plano: "Anual",
      desde: "15 Ago 2024",
      telefone: "+244 989 012 345",
      status: "Ativo"
    }
  ];

  const planos = ["Todos", "Diário", "Semanal", "Mensal", "Anual", "Anual Premium"];

  const filteredAtletas = atletas
    .filter(atleta => {
      const matchesSearch = atleta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        atleta.telefone.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlano = !filtroPlano || filtroPlano === "Todos" || atleta.plano.includes(filtroPlano);
      return matchesSearch && matchesPlano;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.nome.localeCompare(b.nome);
      } else {
        return b.nome.localeCompare(a.nome);
      }
    });

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Atletas</h1>
            <p className="text-muted-foreground">
              Gerenciamento de membros do MGM Fitness
            </p>
          </div>
          <Button
            className="bg-mgm-blue hover:bg-mgm-blue-dark"
            onClick={() => setIsNovoAtletaModalOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Atleta
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou telefone"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortOrder}
                className="h-10 w-10"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
              {planos.map(plano => (
                <Button
                  key={plano}
                  variant={filtroPlano === plano ? "default" : "outline"}
                  className={filtroPlano === plano ? "bg-mgm-blue hover:bg-mgm-blue-dark" : ""}
                  onClick={() => setFiltroPlano(plano === "Todos" ? null : plano)}
                >
                  {plano}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredAtletas.length > 0 ? (
          filteredAtletas.map((atleta) => (
            <Card key={atleta.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center p-6">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarImage src={atleta.imagem} />
                    <AvatarFallback className="bg-mgm-blue text-white text-xl">
                      {atleta.iniciais}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid md:grid-cols-5 flex-1 gap-4">
                    <div className="space-y-1 md:col-span-2">
                      <p className="font-medium text-lg">{atleta.nome}</p>
                      <p className="text-sm text-muted-foreground">{atleta.telefone}</p>
                      <p className="text-xs">Membro desde: {atleta.desde}</p>
                    </div>
                    <div className="flex items-center">
                      <Badge className={
                        atleta.plano.includes('Anual') ? 'bg-mgm-blue' :
                          atleta.plano.includes('Mensal') ? 'bg-green-500' :
                            atleta.plano.includes('Semanal') ? 'bg-yellow-500' :
                              'bg-gray-500'
                      }>
                        {atleta.plano}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <Badge variant={atleta.status === 'Ativo' ? 'outline' : 'destructive'}>
                        {atleta.status}
                      </Badge>
                    </div>
                    <div className="flex justify-end items-center gap-2">
                      <Button variant="outline" size="sm">Perfil</Button>
                      <Button variant="outline" size="sm" className="bg-mgm-blue/10 text-mgm-blue border-mgm-blue/20">
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-8">
            <p className="text-lg font-medium">Nenhum atleta encontrado</p>
            <p className="text-muted-foreground">Tente ajustar os filtros de busca ou adicione um novo atleta.</p>
          </div>
        )}
      </div>

      <NovoAtletaModal
        isOpen={isNovoAtletaModalOpen}
        onClose={() => setIsNovoAtletaModalOpen(false)}
      />
    </Layout>
  );
};

export default Atletas;

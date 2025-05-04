"use client"
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown, UserPlus } from 'lucide-react';
import { NovoAtletaModal } from '@/components/atletas/NovoAtletaModal';

interface Athlete {
  id: string;
  name: string;
  initials?: string;
  phone?: string;
  membershipStart?: string;
  status: string;
  plan?: { name: string };
  image?: { url: string };
}

interface ApiResponse {
  data: Athlete[];
  meta: { total: number; page: number; limit: number };
}

const Atletas: React.FC = () => {
  const [isNovoAtletaModalOpen, setIsNovoAtletaModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filtroPlano, setFiltroPlano] = useState<string | null>(null);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [plans, setPlans] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
          ...(searchTerm && { search: searchTerm }),
          ...(filtroPlano && { plan: filtroPlano }),
          sortOrder,
        });

        const [athletesRes, plansRes] = await Promise.all([
          fetch(`/api/athletes?${params}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch('/api/plans', {
            headers: { 'Content-Type': 'application/json' },
          }),
        ]);

        if (!athletesRes.ok) throw new Error('Failed to fetch athletes');
        if (!plansRes.ok) throw new Error('Failed to fetch plans');

        const athletesData: ApiResponse = await athletesRes.json();
        const plansData: { id: string; name: string }[] = await plansRes.json();

        setAthletes(athletesData.data);
        setPlans(['Todos', ...plansData.map(p => p.name)]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchTerm, filtroPlano, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleCreateAthlete = async (athleteData: Partial<Athlete>) => {
    try {
      const token = localStorage.getItem('token');
      const createRes = await fetch('/api/athletes', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(athleteData),
      });

      if (!createRes.ok) throw new Error('Failed to create athlete');

      setIsNovoAtletaModalOpen(false);

      const fetchRes = await fetch('/api/athletes', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!fetchRes.ok) throw new Error('Failed to fetch athletes');

      const data: ApiResponse = await fetchRes.json();
      setAthletes(data.data);
    } catch (error) {
      console.error('Error creating athlete:', error);
    }
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
              {plans.map(plano => (
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

      {loading ? (
        <div className="text-center p-8">Carregando...</div>
      ) : (
        <div className="grid gap-4">
          {athletes.length > 0 ? (
            athletes.map((atleta) => (
              <Card key={atleta.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-6">
                    <Avatar className="h-16 w-16 mr-4">
                      <AvatarImage src={atleta.image?.url} />
                      <AvatarFallback className="bg-mgm-blue text-white text-xl">
                        {atleta.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid md:grid-cols-5 flex-1 gap-4">
                      <div className="space-y-1 md:col-span-2">
                        <p className="font-medium text-lg">{atleta.name}</p>
                        <p className="text-sm text-muted-foreground">{atleta.phone}</p>
                        <p className="text-xs">Membro desde: {atleta.membershipStart ? new Date(atleta.membershipStart).toLocaleDateString() : '-'}</p>
                      </div>
                      <div className="flex items-center">
                        <Badge className={
                          atleta.plan?.name.includes('Anual') ? 'bg-mgm-blue' :
                            atleta.plan?.name.includes('Mensal') ? 'bg-green-500' :
                              atleta.plan?.name.includes('Semanal') ? 'bg-yellow-500' :
                                'bg-gray-500'
                        }>
                          {atleta.plan?.name}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <Badge variant={atleta.status === 'ACTIVE' ? 'outline' : 'destructive'}>
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
      )}

      <NovoAtletaModal
        isOpen={isNovoAtletaModalOpen}
        onClose={() => setIsNovoAtletaModalOpen(false)}
        onSubmit={handleCreateAthlete}
        plans={plans.filter(p => p !== 'Todos').map(name => ({ name }))}
      />
    </Layout>
  );
};

export default Atletas;
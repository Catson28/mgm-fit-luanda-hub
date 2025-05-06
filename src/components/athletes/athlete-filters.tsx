import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";

interface Plan {
  id: string;
  name: string;
}

interface FilterOptions {
  status: string;
  plan: string;
  startDate: string;
  endDate: string;
}

interface AthleteFiltersProps {
  currentFilters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
}

export function AthleteFilters({ currentFilters, onApplyFilters }: AthleteFiltersProps) {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterOptions>({
    status: currentFilters.status || "all",
    plan: currentFilters.plan || "all",
    startDate: currentFilters.startDate,
    endDate: currentFilters.endDate,
  });
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(
    currentFilters.startDate ? new Date(currentFilters.startDate) : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    currentFilters.endDate ? new Date(currentFilters.endDate) : undefined
  );

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/plans");
        if (!response.ok) {
          throw new Error("Falha ao carregar planos");
        }
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os planos para filtro.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [toast]);

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value }));
  };

  const handlePlanChange = (value: string) => {
    setFilters(prev => ({ ...prev, plan: value }));
  };

  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
    setFilters(prev => ({ 
      ...prev, 
      startDate: date ? date.toISOString() : "" 
    }));
  };

  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date);
    setFilters(prev => ({ 
      ...prev, 
      endDate: date ? date.toISOString() : "" 
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: "all",
      plan: "all",
      startDate: "",
      endDate: "",
    });
    setFromDate(undefined);
    setToDate(undefined);
  };

  const handleApplyFilters = () => {
    const adjustedFilters = {
      status: filters.status === "all" ? "" : filters.status,
      plan: filters.plan === "all" ? "" : filters.plan,
      startDate: filters.startDate,
      endDate: filters.endDate,
    };
    onApplyFilters(adjustedFilters);
  };

  return (
    <div className="py-4 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={filters.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ACTIVE">Ativos</SelectItem>
              <SelectItem value="INACTIVE">Inativos</SelectItem>
              <SelectItem value="SUSPENDED">Suspensos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Plano</label>
          <Select
            value={filters.plan}
            onValueChange={handlePlanChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os planos" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <div className="flex justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="no-plan">Sem plano</SelectItem>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Data de Início</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">De</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    {fromDate ? (
                      format(fromDate, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={handleFromDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Até</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    {toDate ? (
                      format(toDate, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={handleToDateChange}
                    disabled={date => fromDate ? date < fromDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-4">
        <Button onClick={handleApplyFilters}>
          Aplicar Filtros
        </Button>
        <Button variant="outline" onClick={handleResetFilters}>
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}
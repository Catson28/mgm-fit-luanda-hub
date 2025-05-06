import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// Esquema de validação com Zod
const planFeatureSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Funcionalidade deve ter pelo menos 3 caracteres" }),
  included: z.boolean(),
});

const planSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  price: z.number().min(0, { message: "Preço deve ser maior ou igual a 0" }),
  period: z.string().min(1, { message: "Período é obrigatório" }),
  description: z.string().optional().nullable(),
  isPopular: z.boolean(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  features: z.array(planFeatureSchema),
});

type FormValues = z.infer<typeof planSchema>;

interface PlanFormProps {
  plan: {
    id?: string;
    name: string;
    price: number;
    period: string;
    description?: string | null;
    isPopular: boolean;
    status: "ACTIVE" | "INACTIVE";
    features: { id?: string; name: string; included: boolean }[];
  } | null;
  onSuccess: () => void;
}

export function PlanForm({ plan, onSuccess }: PlanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: plan?.name || "",
      price: plan?.price || 0,
      period: plan?.period || "",
      description: plan?.description || "",
      isPopular: plan?.isPopular || false,
      status: plan?.status || "ACTIVE",
      features: plan?.features || [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        price: data.price,
        period: data.period,
        description: data.description,
        isPopular: data.isPopular,
        status: data.status,
        features: data.features,
      };

      const url = plan ? `/api/plans/${plan.id}` : "/api/plans";
      const method = plan ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Falha ao ${plan ? "atualizar" : "criar"} plano`);
      }

      toast.success(plan ? "Plano atualizado com sucesso." : "Plano criado com sucesso.");
      onSuccess();
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error(`Não foi possível ${plan ? "atualizar" : "criar"} o plano.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFeature = () => {
    const currentFeatures = form.getValues("features");
    form.setValue("features", [
      ...currentFeatures,
      { name: "", included: true },
    ]);
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features");
    form.setValue(
      "features",
      currentFeatures.filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Plano*</FormLabel>
                <FormControl>
                  <Input placeholder="Ex.: Mensal Completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (Kz)*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="1500.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Período*</FormLabel>
                <FormControl>
                  <Input placeholder="Ex.: Por mês" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Ativo</SelectItem>
                    <SelectItem value="INACTIVE">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPopular"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Plano Popular</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Destacar como plano popular
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição do plano..."
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <FormLabel>Funcionalidades</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="bg-mgm-blue/10 text-mgm-blue border-mgm-blue/20"
              onClick={addFeature}
            >
              <Plus className="h-4 w-4 mr-2" /> Adicionar
            </Button>
          </div>
          {form.watch("features").map((feature, index) => (
            <div key={index} className="flex items-end gap-4 mb-2">
              <FormField
                control={form.control}
                name={`features.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Ex.: Acesso à musculação" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`features.${index}.included`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Incluído</FormLabel>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="text-red-600 border-red-600/20"
                onClick={() => removeFeature(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={onSuccess}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-mgm-blue hover:bg-mgm-blue-dark"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {plan ? "Atualizar" : "Criar"} Plano
          </Button>
        </div>
      </form>
    </Form>
  );
}
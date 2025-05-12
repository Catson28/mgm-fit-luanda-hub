import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Upload } from "lucide-react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { AthleteProps } from "@/components/pages/Atletas";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EnhancedDatePicker } from "@/components/athletes/EnhancedDatePicker"; // Ajuste o caminho conforme necessário


// Definir esquema de validação com zod
const athleteSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  initials: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  membershipStart: z.date().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
  planId: z.string().optional().nullable(),
  imageFile: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine(
      (file) => !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      { message: "Apenas imagens JPEG, PNG ou GIF são permitidas" }
    )
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "A imagem deve ter no máximo 5MB",
    }),
  imageUrl: z.string().optional().nullable(),
  imagePublicId: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof athleteSchema>;

interface Plan {
  id: string;
  name: string;
}

interface AthleteFormProps {
  athlete: AthleteProps | null;
  onSuccess: () => void;
}

// Interface para o input personalizado do DatePicker
// interface CustomDatePickerInputProps {
//   value: string;
//   onClick: () => void;
//   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   onClear: (e: React.MouseEvent<HTMLButtonElement>) => void;
//   [key: string]: any;
// }

// Componente personalizado para input do DatePicker
// const CustomDatePickerInput = ({ value, onClick, onChange, onClear, ...props }: CustomDatePickerInputProps) => (
//   <div className="relative w-full">
//     <Input
//       value={value}
//       onClick={onClick}
//       onChange={onChange}
//       className="pl-3 pr-12 cursor-pointer"
//       readOnly
//       {...props}
//     />
//     <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
//       {value && (
//         <Button
//           type="button"
//           variant="ghost"
//           size="sm"
//           className="h-6 w-6 p-0"
//           onClick={onClear}
//         >
//           <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
//         </Button>
//       )}
//       <CalendarIcon className="h-4 w-4 text-muted-foreground" />
//     </div>
//   </div>
// );

// Interface para o cabeçalho do DatePicker
// interface CustomDatePickerHeaderProps {
//   date: Date;
//   decreaseMonth: () => void;
//   increaseMonth: () => void;
//   prevMonthButtonDisabled: boolean;
//   nextMonthButtonDisabled: boolean;
// }

// Componente personalizado para cabeçalho do calendário
// const CustomDatePickerHeader = ({
//   date,
//   decreaseMonth,
//   increaseMonth,
//   prevMonthButtonDisabled,
//   nextMonthButtonDisabled,
// }: CustomDatePickerHeaderProps) => (
//   <div className="flex justify-between items-center px-2 py-1.5">
//     <Button
//       onClick={decreaseMonth}
//       disabled={prevMonthButtonDisabled}
//       variant="ghost"
//       size="sm"
//       className="h-7 w-7 p-0"
//     >
//       <ChevronLeft className="h-4 w-4" />
//     </Button>

//     <span className="text-sm font-medium">
//       {format(date, "MMMM yyyy", { locale: ptBR })}
//     </span>

//     <Button
//       onClick={increaseMonth}
//       disabled={nextMonthButtonDisabled}
//       variant="ghost"
//       size="sm"
//       className="h-7 w-7 p-0"
//     >
//       <ChevronRight className="h-4 w-4" />
//     </Button>
//   </div>
// );

// Interface para o campo do formulário
// interface FieldProps {
//   value: Date | null;
//   onChange: (date: Date | null) => void;
// }

// Componente DatePicker melhorado
// const EnhancedDatePicker = ({ field }: { field: FieldProps }) => {
//   const handleClearDate = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation();
//     field.onChange(null);
//   }, [field]);

//   return (
//     <DatePicker
//       selected={field.value}
//       onChange={(date: Date | null) => field.onChange(date)}
//       dateFormat="dd/MM/yyyy"
//       locale={ptBR}
//       placeholderText="Selecione uma data"
//       customInput={
//         <CustomDatePickerInput
//           value=""
//           onClick={() => { }}
//           onChange={() => { }}
//           onClear={handleClearDate}
//         />
//       }
//       renderCustomHeader={(props: CustomDatePickerHeaderProps) => <CustomDatePickerHeader {...props} />}
//       showYearDropdown
//       showMonthDropdown
//       dropdownMode="select"
//       yearDropdownItemNumber={15}
//       className="w-full"
//       popperClassName="react-datepicker-popper z-50"
//       popperPlacement="bottom-start"
//       popperModifiers={[
//         {
//           name: "offset",
//           options: {
//             offset: [0, 8]
//           },
//           fn: (state) => state // Adicionar a função fn para resolver o erro
//         }
//       ]}
//       todayButton="Hoje"
//       calendarClassName="bg-popover border border-border rounded-md shadow-md px-1.5 py-2"
//       dayClassName={(date: Date) =>
//         cn(
//           "mx-0.5 rounded hover:bg-accent/70 transition-colors text-sm",
//           field.value && date.getTime() === field.value.getTime() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent"
//         )
//       }
//       wrapperClassName="w-full"
//     />
//   );
// };

export function AthleteForm({ athlete, onSuccess }: AthleteFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(athlete?.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  // Configurar formulário com valores padrão
  const form = useForm<FormValues>({
    resolver: zodResolver(athleteSchema),
    defaultValues: {
      name: athlete?.name || "",
      initials: athlete?.initials || "",
      phone: athlete?.phone || "",
      membershipStart: athlete?.membershipStart ? new Date(athlete.membershipStart) : null,
      status: athlete?.status || "ACTIVE",
      planId: athlete?.planId || null,
      imageFile: null,
      imageUrl: athlete?.imageUrl || null,
      imagePublicId: null,
    },
  });

  // Buscar planos disponíveis
  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/plans?status=ACTIVE");
        if (!response.ok) {
          throw new Error("Falha ao carregar planos");
        }
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os planos disponíveis.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [toast]);

  // Atualizar preview da imagem quando um arquivo é selecionado
  const handleImageChange = useCallback(
    (file: File | null) => {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(athlete?.imageUrl || null);
      }
    },
    [athlete?.imageUrl]
  );

  // Fazer upload da imagem
  const uploadImage = async (file: File): Promise<{ url: string; publicId?: string }> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao fazer upload da imagem");
      }

      const data = await response.json();
      return { url: data.url, publicId: data.publicId };
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      let imageData: { url?: string; publicId?: string } = {
        url: data.imageUrl ?? undefined,
        publicId: data.imagePublicId ?? undefined,
      };

      // Fazer upload da imagem se um arquivo foi selecionado
      if (data.imageFile) {
        imageData = await uploadImage(data.imageFile);
      }

      const payload = {
        name: data.name,
        initials: data.initials,
        phone: data.phone,
        membershipStart: data.membershipStart ? data.membershipStart.toISOString() : null,
        status: data.status,
        planId: data.planId,
        imageUrl: imageData.url || null,
        imagePublicId: imageData.publicId || null,
      };

      const url = athlete ? `/api/athletes/${athlete.id}` : "/api/athletes";
      const method = athlete ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Falha ao ${athlete ? "atualizar" : "criar"} atleta`);
      }

      toast({
        title: athlete ? "Atleta atualizado" : "Atleta criado",
        description: athlete
          ? "As informações do atleta foram atualizadas com sucesso."
          : "Novo atleta cadastrado com sucesso.",
      });

      onSuccess();
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast({
        title: "Erro",
        description: `Não foi possível ${athlete ? "atualizar" : "criar"} o atleta.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gerar iniciais automaticamente quando o nome mudar
  const updateInitials = (fullName: string) => {
    if (!fullName) return "";

    // Se o atleta já tem iniciais definidas, não alterar
    if (athlete?.initials) return athlete.initials;

    const names = fullName.trim().split(" ");
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();

    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="imageFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto do Atleta</FormLabel>
              <FormControl>
                <div className="flex justify-center mb-4">
                  <label
                    htmlFor="image-upload"
                    className={cn(
                      "relative group cursor-pointer transition-all duration-200",
                      "hover:ring-4 hover:ring-mgm-blue/20 rounded-full"
                    )}
                  >
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={imagePreview || ""} />
                      <AvatarFallback className="text-2xl bg-mgm-blue text-white">
                        {form.watch("initials") || form.watch("name").substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                      <div
                        className={cn(
                          "absolute inset-0 flex items-center justify-center",
                          "bg-black/50 opacity-0 group-hover:opacity-100 rounded-full",
                          "transition-opacity duration-200"
                        )}
                      >
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                    </Avatar>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        field.onChange(file);
                        handleImageChange(file);
                      }}
                      ref={field.ref}
                    />
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    )}
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome do atleta"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      form.setValue("initials", updateInitials(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="initials"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Iniciais</FormLabel>
                <FormControl>
                  <Input
                    placeholder="RF"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+244 923 456 789"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="planId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plano</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === "null" ? null : value)}
                  value={field.value ?? "null"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um plano" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoading ? (
                      <div className="flex justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      <>
                        <SelectItem value="null">Sem plano</SelectItem>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="membershipStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Início</FormLabel>
                <FormControl>
                  <EnhancedDatePicker field={field} />
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
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Ativo</SelectItem>
                    <SelectItem value="INACTIVE">Inativo</SelectItem>
                    <SelectItem value="SUSPENDED">Susp obsessivo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onSuccess}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-mgm-blue hover:bg-mgm-blue-dark"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {athlete ? "Atualizar" : "Cadastrar"} Atleta
          </Button>
        </div>
      </form>
    </Form>
  );
}
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MultiSelect } from "@/components/ui/multi-select";

// Esquema de validação com Zod
const eventSchema = z.object({
  title: z.string().min(3, { message: "Título deve ter pelo menos 3 caracteres" }),
  description: z.string().optional().nullable(),
  date: z.date({ required_error: "Data é obrigatória" }),
  location: z.string().optional().nullable(),
  status: z.enum(["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"]),
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
  athleteIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof eventSchema>;

interface Athlete {
  id: string;
  name: string;
  initials?: string | null;
}

interface EventFormProps {
  event: {
    id?: string;
    title: string;
    description?: string | null;
    date: Date;
    location?: string | null;
    status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";
    image?: { url: string; publicId?: string } | null;
    registrations: { athleteId: string }[];
  } | null;
  onSuccess: () => void;
}

export function EventForm({ event, onSuccess }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(event?.image?.url || null);
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  // Configurar formulário com valores padrão
  const form = useForm<FormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      date: event?.date ? new Date(event.date) : new Date(),
      location: event?.location || "",
      status: event?.status || "SCHEDULED",
      imageFile: null,
      imageUrl: event?.image?.url || null,
      imagePublicId: event?.image?.publicId || null,
      athleteIds: event?.registrations.map((r) => r.athleteId) || [],
    },
  });

  // Buscar atletas disponíveis
  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await fetch("/api/athletes?status=ACTIVE", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Falha ao carregar atletas");
        }
        const data = await response.json();
        setAthletes(data);
      } catch (error) {
        console.error("Erro ao buscar atletas:", error);
        toast.error("Não foi possível carregar os atletas.");
      }
    };
    fetchAthletes();
  }, []);

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
        setImagePreview(event?.image?.url || null);
      }
    },
    [event?.image?.url]
  );

  // Fazer upload da imagem
  const uploadImage = async (file: File): Promise<{ url: string; publicId?: string }> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
        url: data.imageUrl === null ? undefined : data.imageUrl,
        publicId: data.imagePublicId === null ? undefined : data.imagePublicId,
      };

      // Fazer upload da imagem se um arquivo foi selecionado
      if (data.imageFile) {
        imageData = await uploadImage(data.imageFile);
      }

      const payload = {
        title: data.title,
        description: data.description,
        date: data.date.toISOString(),
        location: data.location,
        status: data.status,
        imageUrl: imageData.url || null,
        imagePublicId: imageData.publicId || null,
        athleteIds: data.athleteIds || [],
      };

      const url = event ? `/api/events/${event.id}` : "/api/events";
      const method = event ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Falha ao ${event ? "atualizar" : "criar"} evento`);
      }

      toast.success(event ? "Evento atualizado com sucesso." : "Evento criado com sucesso.");
      onSuccess();
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error(`Não foi possível ${event ? "atualizar" : "criar"} o evento.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-center mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={imagePreview || ""} />
            <AvatarFallback className="text-2xl bg-mgm-blue text-white">
              {form.watch("title")?.substring(0, 2).toUpperCase() || "EV"}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título*</FormLabel>
                <FormControl>
                  <Input placeholder="Ex.: Campeonato de Fisiculturismo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex.: MGM Fitness Arena"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data e Hora*</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy HH:mm", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                    <div className="p-3 border-t">
                      <Input
                        type="time"
                        value={field.value ? format(field.value, "HH:mm") : ""}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const newDate = new Date(field.value || new Date());
                          newDate.setHours(parseInt(hours) || 0, parseInt(minutes) || 0);
                          field.onChange(newDate);
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
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
                    <SelectItem value="SCHEDULED">Agendado</SelectItem>
                    <SelectItem value="ONGOING">Em Andamento</SelectItem>
                    <SelectItem value="COMPLETED">Concluído</SelectItem>
                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageFile"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Imagem do Evento</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        onChange(file);
                        handleImageChange(file);
                      }}
                      {...field}
                      className="flex-1"
                    />
                    {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                </FormControl>
                <FormMessage />
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
                  placeholder="Descrição do evento..."
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="athleteIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Atletas Registrados</FormLabel>
              <FormControl>
                <MultiSelect
                  options={athletes.map((athlete) => ({
                    value: athlete.id,
                    label: athlete.name,
                  }))}
                  value={field.value || []}
                  onValueChange={field.onChange}
                  placeholder="Selecione atletas..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
            {event ? "Atualizar" : "Criar"} Evento
          </Button>
        </div>
      </form>
    </Form>
  );
}
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, CalendarIcon } from "lucide-react";
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
import Image from "next/image";

// Esquema de validação com Zod
const gallerySchema = z.object({
  title: z.string().min(3, { message: "Título deve ter pelo menos 3 caracteres" }),
  description: z.string().optional().nullable(),
  date: z.date().optional().nullable(),
  imageFile: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      { message: "Apenas imagens JPEG, PNG ou GIF são permitidas" }
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "A imagem deve ter no máximo 5MB",
    }),
  imageUrl: z.string().optional().nullable(),
  imagePublicId: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof gallerySchema>;

interface GalleryFormProps {
  galleryItem: {
    id?: string;
    title: string;
    description?: string | null;
    date?: Date | null;
    image: { url: string; publicId?: string };
  } | null;
  onSuccess: () => void;
}

export function GalleryForm({ galleryItem, onSuccess }: GalleryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(galleryItem?.image?.url || null);

  // Configurar formulário com valores padrão
  const form = useForm<FormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: galleryItem?.title || "",
      description: galleryItem?.description || "",
      date: galleryItem?.date ? new Date(galleryItem.date) : null,
      imageFile: undefined,
      imageUrl: galleryItem?.image?.url || null,
      imagePublicId: galleryItem?.image?.publicId || null,
    },
  });

  // Atualizar preview da imagem quando um arquivo é selecionado
  const handleImageChange = useCallback(
    (file: File | undefined) => {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(galleryItem?.image?.url || null);
      }
    },
    [galleryItem?.image?.url]
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
        url: data.imageUrl ?? undefined,
        publicId: data.imagePublicId ?? undefined,
      };

      // Fazer upload da imagem se um arquivo foi selecionado
      if (data.imageFile) {
        imageData = await uploadImage(data.imageFile);
      }

      const payload = {
        title: data.title,
        description: data.description,
        date: data.date ? data.date.toISOString() : null,
        imageUrl: imageData.url,
        imagePublicId: imageData.publicId || null,
      };

      const url = galleryItem ? `/api/gallery/${galleryItem.id}` : "/api/gallery";
      const method = galleryItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Falha ao ${galleryItem ? "atualizar" : "criar"} item da galeria`);
      }

      toast.success(
        galleryItem
          ? "Item da galeria atualizado com sucesso."
          : "Item da galeria criado com sucesso."
      );
      onSuccess();
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error(`Não foi possível ${galleryItem ? "atualizar" : "criar"} o item da galeria.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-center mb-4">
          <Image
            src={imagePreview || "/placeholder.png"}
            alt="Preview"
            width={192}
            height={192}
            className="w-48 h-48 object-cover rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título*</FormLabel>
                <FormControl>
                  <Input placeholder="Ex.: Competição 2025" {...field} />
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
                <FormLabel>Data</FormLabel>
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
                          format(field.value, "dd/MM/yyyy", { locale: ptBR })
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
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageFile"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Imagem*</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
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
                  placeholder="Descrição do item da galeria..."
                  {...field}
                  value={field.value || ""}
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
            {galleryItem ? "Atualizar" : "Criar"} Item
          </Button>
        </div>
      </form>
    </Form>
  );
}
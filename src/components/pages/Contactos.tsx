
import { WebsiteLayout } from '@/components/layout/WebsiteLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Mail, MapPin, Phone } from 'lucide-react';

const Contactos = () => {
  const form = useForm({
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      mensagem: ""
    }
  });

  const onSubmit = (data: any) => {
    console.log("Dados do formulário enviados:", data);
    // Aqui você implementaria a lógica para enviar o formulário
  };

  return (
    <WebsiteLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">Contactos</h1>
            <p className="text-muted-foreground mt-2">
              Entre em contacto com a equipe do MGM Fitness
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Envie uma mensagem</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="nome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <FormControl>
                                <Input placeholder="Seu nome" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Seu email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu número de telefone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mensagem"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mensagem</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Digite sua mensagem aqui" 
                                className="min-h-[150px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full bg-mgm-blue hover:bg-mgm-blue-dark">
                        Enviar Mensagem
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-mgm-red h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-medium">Endereço</p>
                      <p className="text-sm text-muted-foreground">
                        Samba, Luanda, frente à Trirumo
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-mgm-red h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-medium">Telefone</p>
                      <p className="text-sm text-muted-foreground">
                        +244 923 456 789
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-mgm-red h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        contato@mgmfitness.co.ao
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horário de Funcionamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p>Segunda a Sexta</p>
                      <p className="font-medium">06:00 - 22:00</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Sábado</p>
                      <p className="font-medium">08:00 - 18:00</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Domingo</p>
                      <p className="font-medium">08:00 - 12:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Redes Sociais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <Button variant="outline" className="flex-1">Facebook</Button>
                    <Button variant="outline" className="flex-1">Instagram</Button>
                    <Button variant="outline" className="flex-1">WhatsApp</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mt-6">
            <CardContent className="p-0">
              <div className="aspect-[2/1] w-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126166.25507262156!2d13.184618990668581!3d-8.83797289665538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f15cdc8d2c7d%3A0x850c1c5c5ecc5a92!2sLuanda%2C%20Angola!5e0!3m2!1sen!2sus!4v1715279793912!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default Contactos;

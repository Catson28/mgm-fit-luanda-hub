"use client"

import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  // FormLabel,
} from '@/components/ui/form';
import { FormLabel } from '@/components/ui/form-custom';
import { useForm } from 'react-hook-form';

const Configuracoes = () => {
  const form = useForm({
    defaultValues: {
      nome: 'MGM Fitness Luanda',
      email: 'contato@mgmfitness.co.ao',
      telefone: '+244 923 456 789',
      endereco: 'Samba, Luanda, frente à Trirumo',
      notificacoes_email: true,
      notificacoes_app: true,
      relatorios_automaticos: false,
      tema_escuro: false,
    }
  });

  const onSubmit = (data) => {
    console.log('Configurações atualizadas:', data);
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-mgm-red" />
            <div>
              <h1 className="font-heading text-3xl font-bold">Configurações</h1>
              <p className="text-muted-foreground">
                Gerencie as configurações do sistema
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Wrap the entire form content with Form provider */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Gerais</CardTitle>
                  <CardDescription>
                    Configure as informações básicas do ginásio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Nome do Ginásio</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do ginásio" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Email de contacto" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="Telefone de contacto" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endereco"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input placeholder="Endereço físico" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>
                    Configure como deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notificacoes_email"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Notificações por Email
                          </FormLabel>
                          <FormDescription>
                            Receba atualizações via email
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notificacoes_app"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Notificações no Aplicativo
                          </FormLabel>
                          <FormDescription>
                            Receba alertas dentro do sistema
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="relatorios_automaticos"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Relatórios Automáticos
                          </FormLabel>
                          <FormDescription>
                            Enviar relatórios semanais por email
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Rest of your form fields... */}
              {/* Make sure all form fields use FormField component */}

              <div className="flex justify-end">
                <Button type="submit" className="bg-mgm-blue hover:bg-mgm-blue-dark">
                  Salvar Configurações
                </Button>
              </div>
            </form>
          </Form>
        </div>


        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Configurações de segurança e acesso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  Alterar Senha
                </Button>
                <Button variant="outline" className="w-full">
                  Configurar Autenticação de Dois Fatores
                </Button>
              </div>
              <Separator className="my-4" />
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  A última vez que você fez login foi em:
                </p>
                <p className="font-medium">29/04/2025 às 14:35</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Endereço IP: 197.218.177.xxx
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Configurações visuais da interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <FormField
                control={form.control}
                name="tema_escuro"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Modo Escuro
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              /> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Configuracoes;
import { WebsiteLayout } from '@/components/layout/WebsiteLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { DollarSign, Info, LayoutList, Mail, NewspaperIcon, UserPlus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Home = () => {
  return (
    <WebsiteLayout>
      <div className="flex flex-col gap-8 pb-8">
        {/* Hero Section */}
        <div className="w-full py-12 md:py-24 lg:py-32 bg-mgm-blue rounded-xl relative overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4 z-10">
                <div className="space-y-2">
                  <h1 className="text-3xl text-white font-bold tracking-tighter sm:text-4xl md:text-5xl">MGM Fitness Luanda</h1>
                  <p className="max-w-[600px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Transforme seu corpo, transforme sua vida. A academia que mais cresce em Luanda.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-mgm-red hover:bg-red-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Inscreva-se
                  </Button>
                  <Button variant="outline" className="bg-white text-mgm-blue hover:bg-gray-100">
                    Conheça Nossos Planos
                  </Button>
                </div>
              </div>
              <div className="bg-muted rounded-xl p-2">
                <Image fill 
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
                  alt="MGM Fitness"
                  className="w-full h-full object-cover rounded-lg"
                  style={{ objectFit: 'cover', aspectRatio: '4/3' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/sobre">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <Info className="mr-2 h-4 w-4" />
                      Sobre
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/funcionalidades">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <LayoutList className="mr-2 h-4 w-4" />
                      Funcionalidades
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/precos">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Preços
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/blog">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <NewspaperIcon className="mr-2 h-4 w-4" />
                      Blog
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/contactos">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <Mail className="mr-2 h-4 w-4" />
                      Contactos
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Featured Sections */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Treinos Personalizados</CardTitle>
                <CardDescription>Alcance seus objetivos com planos de treino personalizados</CardDescription>
              </CardHeader>
              <CardContent>
                <Image fill 
                  src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e"
                  alt="Treino personalizado"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p className="text-sm text-muted-foreground">
                  Nossos treinadores certificados criam programas adaptados às suas necessidades,
                  garantindo resultados eficientes e seguros.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Equipamentos Modernos</CardTitle>
                <CardDescription>Tecnologia de ponta para o seu melhor desempenho</CardDescription>
              </CardHeader>
              <CardContent>
                <Image fill 
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
                  alt="Equipamentos modernos"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p className="text-sm text-muted-foreground">
                  Contamos com uma grande variedade de equipamentos de última geração,
                  proporcionando eficiência e segurança para seus treinos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ambiente Motivador</CardTitle>
                <CardDescription>Comunidade que inspira e apoia</CardDescription>
              </CardHeader>
              <CardContent>
                <Image fill 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
                  alt="Ambiente motivador"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p className="text-sm text-muted-foreground">
                  Um ambiente amigável e motivador, com uma comunidade engajada
                  que compartilha objetivos e conquistas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default Home;

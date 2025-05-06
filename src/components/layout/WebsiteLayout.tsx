"use client"
import { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

interface WebsiteLayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  path: string;
}

export function WebsiteLayout({ children }: WebsiteLayoutProps) {
  const pathname = usePathname();
  
  const navigationItems: NavItem[] = [
    { name: 'Home', path: '/admin' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Funcionalidades', path: '/funcionalidades' },
    { name: 'Preços', path: '/precos' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contactos', path: '/contactos' },
  ];
  
  const mobileNavItems: NavItem[] = [
    { name: 'Home', path: '/home' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Funcionalidades', path: '/funcionalidades' },
    { name: 'Preços', path: '/precos' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contactos', path: '/contactos' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="bg-mgm-blue text-white sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">MGM Fitness</h1>
            </div>

            {/* Navigation for larger screens */}
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList>
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.path;
                    
                    return (
                      <NavigationMenuItem key={item.name}>
                        <Link href={item.path} legacyBehavior passHref>
                          <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${isActive ? 'bg-white/20' : ''}`}>
                            {item.name}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" className="bg-white text-mgm-blue hover:bg-gray-100">
                Inscrever-se
              </Button>
              <Link href="/dashboard">
                <Button size="sm" variant="secondary">
                  Área Administrativa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-mgm-blue/90 pb-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {mobileNavItems.map((item) => {
              const isActive = pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`px-3 py-1 rounded-full text-sm ${isActive ? 'bg-white text-mgm-blue' : 'bg-mgm-blue-dark/40 text-white'}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-mgm-blue text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MGM Fitness</h3>
              <p className="text-white/80">Samba, Luanda, frente à Trirumo</p>
              <p className="text-white/80">+244 923 456 789</p>
              <p className="text-white/80">contato@mgmfitness.co.ao</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Horários</h3>
              <p className="text-white/80">Segunda a Sexta: 06:00 - 22:00</p>
              <p className="text-white/80">Sábado: 08:00 - 18:00</p>
              <p className="text-white/80">Domingo: 08:00 - 12:00</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><Link href="/home" className="text-white/80 hover:text-white">Home</Link></li>
                <li><Link href="/sobre" className="text-white/80 hover:text-white">Sobre</Link></li>
                <li><Link href="/precos" className="text-white/80 hover:text-white">Preços</Link></li>
                <li><Link href="/contactos" className="text-white/80 hover:text-white">Contactos</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-4 text-center text-white/60">
            <p>© {new Date().getFullYear()} MGM Fitness Luanda. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
"use client"
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users, Calendar, Image, Award, ChevronRight,
  ChevronLeft, BarChart, Settings, DollarSign,
  Home, Info, LayoutList, NewspaperIcon, Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname(); // Usando o hook usePathname do Next.js para obter o caminho atual

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { name: 'Dashboard', icon: BarChart, path: '/' },
    { name: 'Home', icon: Home, path: '/admin' },
    { name: 'Sobre', icon: Info, path: '/sobre' },
    { name: 'Funcionalidades', icon: LayoutList, path: '/funcionalidades' },
    { name: 'Preços', icon: DollarSign, path: '/precos' },
    { name: 'Blog', icon: NewspaperIcon, path: '/blog' },
    { name: 'Contactos', icon: Mail, path: '/contactos' },
    { name: 'Atletas', icon: Users, path: '/atletas' },
    { name: 'Planos', icon: DollarSign, path: '/planos' },
    { name: 'Eventos', icon: Calendar, path: '/eventos' },
    { name: 'Galeria', icon: Image, path: '/galeria' },
    { name: 'Destaques', icon: Award, path: '/destaques' },
    { name: 'Configurações', icon: Settings, path: '/configuracoes' },
  ];

  return (
    <aside
      className={cn(
        "bg-mgm-blue text-white transition-all duration-300 ease-in-out h-screen sticky top-0 z-30 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-mgm-blue-dark">
        {!collapsed && (
          <h2 className="font-heading font-bold text-xl">MGM Fitness</h2>
        )}

        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-mgm-blue-dark transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 py-8 flex flex-col gap-1">
        {menuItems.map((item) => {
          // Verificar se o caminho atual corresponde ao item do menu
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "flex items-center px-4 py-3 gap-3 text-white transition-colors",
                isActive
                  ? "bg-white/20 font-semibold"
                  : "hover:bg-white/10"
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-mgm-blue-dark">
        {!collapsed && (
          <div className="text-center text-sm opacity-70">
            <p>MGM Fitness Luanda</p>
            <p>v1.0.0</p>
          </div>
        )}
      </div>
    </aside>
  );
}
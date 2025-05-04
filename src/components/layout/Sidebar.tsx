"use client"
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users, Calendar, Image, Award, ChevronRight,
  ChevronLeft, BarChart, Settings, DollarSign,
  Home, Info, LayoutList, NewspaperIcon, Mail, Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [siteMenuOpen, setSiteMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleSiteMenu = () => {
    setSiteMenuOpen(!siteMenuOpen);
  };

  // Menu de administração
  const adminMenuItems = [
    { name: 'Dashboard', icon: BarChart, path: '/' },
    { name: 'Home', icon: Home, path: '/admin' },
    { name: 'Atletas', icon: Users, path: '/atletas' },
    { name: 'Planos', icon: DollarSign, path: '/planos' },
    { name: 'Eventos', icon: Calendar, path: '/eventos' },
    { name: 'Galeria', icon: Image, path: '/galeria' },
    { name: 'Destaques', icon: Award, path: '/destaques' },
    { name: 'Configurações', icon: Settings, path: '/configuracoes' },
  ];

  // Menu do site
  const siteMenuItems = [
    { name: 'Sobre', icon: Info, path: '/sobre' },
    { name: 'Funcionalidades', icon: LayoutList, path: '/funcionalidades' },
    { name: 'Preços', icon: DollarSign, path: '/precos' },
    { name: 'Blog', icon: NewspaperIcon, path: '/blog' },
    { name: 'Contactos', icon: Mail, path: '/contactos' },
  ];

  const renderMenuItem = (item) => {
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
  };

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

      <div className="flex-1 py-4 flex flex-col">
        {/* Seção de Administração */}
        <div className="mb-2">
          {!collapsed && (
            <h3 className="text-xs uppercase tracking-wider text-white/60 px-4 py-2">
              Administração
            </h3>
          )}
          <div className="flex flex-col gap-1">
            {adminMenuItems.map(renderMenuItem)}
          </div>
        </div>

        {/* Seção do Site */}
        <div>
          <button
            onClick={toggleSiteMenu}
            className={cn(
              "w-full flex items-center px-4 py-3 gap-3 text-white transition-colors hover:bg-white/10",
              pathname.includes('/sobre') ||
                pathname.includes('/funcionalidades') ||
                pathname.includes('/precos') ||
                pathname.includes('/blog') ||
                pathname.includes('/contactos')
                ? "bg-white/20 font-semibold"
                : ""
            )}
          >
            <Globe size={20} />
            {!collapsed && (
              <>
                <span>Site</span>
                <ChevronRight
                  size={16}
                  className={cn(
                    "ml-auto transition-transform",
                    siteMenuOpen && "transform rotate-90"
                  )}
                />
              </>
            )}
          </button>

          {(siteMenuOpen || collapsed) && (
            <div className={cn(
              "flex flex-col gap-1",
              collapsed ? "pl-0" : "pl-4"
            )}>
              {siteMenuItems.map(renderMenuItem)}
            </div>
          )}
        </div>
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
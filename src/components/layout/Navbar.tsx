"use client"
import { Bell, User, Search, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/services/hooks/useAuth';
import { useSidebar } from '@/components/ui/sidebarContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const { toggleVisibility, visible } = useSidebar();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex-1 flex items-center max-w-md gap-2">
          {/* Botão "hamburger" para mostrar/ocultar o Sidebar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVisibility}
            className="mr-2 text-muted-foreground hover:bg-muted/50"
            aria-label={visible ? "Ocultar menu lateral" : "Mostrar menu lateral"}
            title={visible ? "Ocultar menu lateral" : "Mostrar menu lateral"}
          >
            {visible ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </Button>

          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="pl-8 w-full bg-muted/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-mgm-red rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col p-2 space-y-1">
                <p className="text-sm font-medium">{user?.name || "Admin MGM"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || "admin@mgmfitness.com"}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
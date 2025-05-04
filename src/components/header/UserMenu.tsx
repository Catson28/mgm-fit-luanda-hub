// components/header/UserMenu.tsx
import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

type UserMenuProps = {
  user?: { name: string } | null
  logout: () => void
}

export const UserMenu = ({ user, logout }: UserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center hover:bg-gray-100">
          <User className="mr-2" />
          {user?.name && (
            <>Olá,
              <span className="text-sm text-gray-300">
                {user.name}
              </span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="cursor-pointer">Meu Perfil</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Configurações</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout} className="cursor-pointer text-red-600">Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
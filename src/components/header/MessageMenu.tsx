// components/header/MessageMenu.tsx
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Notification } from './types'

type MessageMenuProps = {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  clearAll: (type: 'message' | 'notification') => void
}

export const MessageMenu = ({ notifications, unreadCount, markAsRead, clearAll }: MessageMenuProps) => {
  const messageItems = notifications.filter(n => n.type === 'message')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
          <MessageCircle />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Mensagens</span>
          {messageItems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearAll('message')}
            >
              Limpar
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {messageItems.map((message) => (
          <DropdownMenuItem
            key={message.id}
            className={`p-3 cursor-pointer ${!message.read ? 'bg-gray-50' : ''}`}
            onClick={() => markAsRead(message.id)}
          >
            <div className="flex flex-col gap-1">
              <div className="font-medium">{message.title}</div>
              <div className="text-sm text-gray-500">{message.message}</div>
              <div className="text-xs text-gray-400">{message.time}</div>
            </div>
          </DropdownMenuItem>
        ))}
        {messageItems.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            Nenhuma mensagem
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
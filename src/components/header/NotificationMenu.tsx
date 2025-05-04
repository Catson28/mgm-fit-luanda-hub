// components/header/NotificationMenu.tsx
import { Bell } from 'lucide-react'
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

type NotificationMenuProps = {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  clearAll: (type: 'message' | 'notification') => void
}

export const NotificationMenu = ({ notifications, unreadCount, markAsRead, clearAll }: NotificationMenuProps) => {
  const notificationItems = notifications.filter(n => n.type === 'notification')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
          <Bell />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notificações</span>
          {notificationItems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearAll('notification')}
            >
              Limpar
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notificationItems.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className={`p-3 cursor-pointer ${!notification.read ? 'bg-gray-50' : ''}`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex flex-col gap-1">
              <div className="font-medium">{notification.title}</div>
              <div className="text-sm text-gray-500">{notification.message}</div>
              <div className="text-xs text-gray-400">{notification.time}</div>
            </div>
          </DropdownMenuItem>
        ))}
        {notificationItems.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            Nenhuma notificação
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
// hooks/useNotifications.ts
import { useState } from 'react'
import { Notification } from '@/services/types'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Novo comentário",
      message: "João comentou no seu post",
      time: "5 min atrás",
      read: false,
      type: 'notification'
    },
    {
      id: "2",
      title: "Nova mensagem",
      message: "Maria: Olá, podemos conversar?",
      time: "10 min atrás",
      read: false,
      type: 'message'
    }
  ])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const clearAll = (type: 'message' | 'notification') => {
    setNotifications(notifications.filter(notif => notif.type !== type))
  }

  const unreadCounts = {
    messages: notifications.filter(n => n.type === 'message' && !n.read).length,
    notifications: notifications.filter(n => n.type === 'notification' && !n.read).length
  }

  return {
    notifications,
    unreadCounts,
    markAsRead,
    clearAll
  }
}
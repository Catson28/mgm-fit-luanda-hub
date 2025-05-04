// src/components/header/types.ts
export interface Notification {
  id: string
  type: 'message' | 'notification'
  title: string
  message: string
  time: string
  read: boolean
}
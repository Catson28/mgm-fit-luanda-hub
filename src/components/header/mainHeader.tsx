// components/header/mainHeader.tsx


"use client"
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { SearchBar } from '@/components/header/SearchBar'
import { LanguageSelector } from '@/components/header/LanguageSelector'
import { NotificationMenu } from '@/components/header/NotificationMenu'
import { MessageMenu } from '@/components/header/MessageMenu'
import { UserMenu } from '@/components/header/UserMenu'
import { useNotifications } from '@/services/hooks/useNotifications'  // You'll need to create this hook
import { useState, useEffect } from 'react'
import { useAuth } from "@/services/hooks/useAuth";
import { useSidebar } from '@/components/ui/sidebarContext';
import Link from 'next/link'

export const Header = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const { toggleSidebar } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("")
  const { user, logout } = useAuth()
  const {
    notifications,
    unreadCounts,
    markAsRead,
    clearAll
  } = useNotifications()  // Custom hook for notification logic

  // Close search on ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchVisible(false)
        setSearchQuery("")
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 justify-between transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4 border-b">
      <div className="flex items-center space-x-4 gap-2">
        <SidebarTrigger className="-ml-1" onClick={toggleSidebar} />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Link href="/" className="text-xl font-semibold hover:text-gray-700 transition-colors">
          Tyula
        </Link>
      </div>

      <SearchBar
        isVisible={isSearchVisible}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsVisible={setIsSearchVisible}
      />

      <div className="flex items-center space-x-4">
        <LanguageSelector />
        <NotificationMenu
          notifications={notifications}
          unreadCount={unreadCounts.notifications}
          markAsRead={markAsRead}
          clearAll={clearAll}
        />
        <MessageMenu
          notifications={notifications}
          unreadCount={unreadCounts.messages}
          markAsRead={markAsRead}
          clearAll={clearAll}
        />
        <UserMenu user={user} logout={logout} />
      </div>
    </header>
  )
}
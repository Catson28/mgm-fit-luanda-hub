// components/header/SearchBar.tsx
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type SearchBarProps = {
  isVisible: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  setIsVisible: (visible: boolean) => void
}

export const SearchBar = ({ isVisible, searchQuery, setSearchQuery, setIsVisible }: SearchBarProps) => {
  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsVisible(true)}
        className="hover:bg-gray-100"
      >
        <Search />
      </Button>
    )
  }

  return (
    <div className="flex space-x-2 items-center bg-gray-100 rounded-lg p-1">
      <Search className="text-gray-400 ml-2" size={20} />
      <Input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Pesquisar..."
        className="w-64 border-none bg-transparent focus:ring-0"
        autoFocus
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setIsVisible(false)
          setSearchQuery("")
        }}
      >
        <X size={20} />
      </Button>
    </div>
  )
}
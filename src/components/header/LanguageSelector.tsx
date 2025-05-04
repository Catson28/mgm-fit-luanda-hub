// components/header/LanguageSelector.tsx
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const LANGUAGES = ['English', 'French', 'Spanish', 'German']

export const LanguageSelector = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:bg-gray-100">
          <Globe className="mr-2" /> English
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem key={lang} className="cursor-pointer">
            {lang}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
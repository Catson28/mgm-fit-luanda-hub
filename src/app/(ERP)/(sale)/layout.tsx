// layout.tsx
import React from "react"
import { Header } from "@/components/header/mainHeader"
/*
import {
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SidebarProvider } from "@/components/ui/sidebarContext";
*/

import { SidebarProvider } from '@/components/ui/sidebarContext';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useCaixa, CaixaProvider } from '@/context/caixaContext';
/*
import {
  SidebarProvider,
} from "@/app/(ERP)/(sale)/(PDV)/venda/sidebarContext"
*/


export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <CaixaProvider>
      <SidebarProvider>

        <div
          className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
        >
          <Header />
          {children}
        </div>
      </SidebarProvider>
    </CaixaProvider>

  )
}

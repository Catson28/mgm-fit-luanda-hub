"use client"
import React from 'react';
import Link from 'next/link'; // Importando o Link do Next.js
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, Package, ShoppingCart,
  DollarSign, FileText, Settings, Star,
  History, Briefcase, UserCheck, Layout
} from "lucide-react";
import { motion } from "framer-motion";

// Define a type for the icon props (similar to what Lucide icons accept)
interface IconProps {
  className?: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

interface ModuleType {
  icon: React.ComponentType<IconProps>; // Added generic type parameter
  title: string;
  description: string;
  route: string;
}

interface QuickAccessType {
  icon: React.ComponentType<IconProps>; // Added generic type parameter
  title: string;
  route: string;
}

const ModuleCard = ({ icon: Icon, title, description, route }: ModuleType) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="h-full" // Garantindo que o container de movimento ocupe toda a altura
    >
      <Link href={route} passHref> {/* Usando Link para navegação */}
        <Card className="hover:bg-slate-50 hover:shadow-lg transition-all duration-300 cursor-pointer group h-full flex flex-col">
          <CardContent className="p-6 pt-6 flex flex-col items-center text-center h-full justify-between">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-12 h-12 text-blue-600 transition-transform group-hover:scale-110" />
                </motion.div>
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
            </div>
            <p className="text-sm text-gray-500">{description}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const QuickAccessItem = ({ icon: Icon, title, route }: QuickAccessType) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link href={route} passHref> {/* Usando Link para navegação */}
        <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-300 group">
          <Icon className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="group-hover:text-blue-600 transition-colors">{title}</span>
        </div>
      </Link>
    </motion.div>
  );
};

const DashboardComponent = () => {

  const modules: ModuleType[] = [
    {
      icon: Layout,
      title: "Visão Geral",
      description: "Dashboard principal com KPIs e métricas importantes",
      route: "/dashboard"
    },
    {
      icon: Users,
      title: "Clientes",
      description: "Gestão de clientes e relatórios",
      route: "/clientes"
    },
    {
      icon: Package,
      title: "Estoque",
      description: "Gestão de estoque e distribuição",
      route: "/estoque"
    },
    {
      icon: ShoppingCart,
      title: "Comercial",
      description: "Vendas, compras e pedidos",
      route: "/venda"
    },
    {
      icon: DollarSign,
      title: "Financeiro",
      description: "Gestão financeira e relatórios",
      route: "/inventory-manager-dashboard"
    },
    {
      icon: UserCheck,
      title: "RH",
      description: "Funcionários e folha de pagamento",
      route: "/rh"
    },
    {
      icon: Briefcase,
      title: "Projetos",
      description: "Gerenciamento de projetos e relatórios",
      route: "/projetos"
    },
    {
      icon: FileText,
      title: "Relatórios",
      description: "Relatórios consolidados do sistema",
      route: "/relatorios"
    }
  ];

  const quickAccess: QuickAccessType[] = [
    { icon: Star, title: "Favoritos", route: "/favoritos" },
    { icon: History, title: "Histórico", route: "/historico" },
    { icon: FileText, title: "Logs", route: "/monitor/logs" },
    { icon: Settings, title: "Configurações", route: "/configuracoes" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-7xl mx-auto"
    >
      <motion.header
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2 text-blue-600">Tyula ERP</h1>
        <p className="text-gray-500">Bem-vindo ao seu sistema de gestão empresarial</p>
      </motion.header>

      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-8 hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {quickAccess.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <QuickAccessItem {...item} />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {modules.map((module, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="h-full" // Garantindo que o container do grid tenha altura total
          >
            <ModuleCard {...module} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default DashboardComponent;
"use client";

import React from "react";
import { motion } from "framer-motion";

interface PreloadProps {
  isLoading: boolean;
}

const Preload: React.FC<PreloadProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop com fundo desfocado */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />

      {/* Conteúdo central */}
      <div className="relative z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-10 rounded-xl">
        {/* Gráfico de carregamento */}
        <LoadingChart />

        {/* Texto de carregamento */}
        <p className="mt-6 text-xl font-medium text-foreground/80">Carregando dados...</p>
      </div>
    </div>
  );
};

// Componente de gráfico de carregamento
const LoadingChart: React.FC = () => {
  return (
    <div className="relative w-32 h-32">
      {/* Círculo de fundo */}
      <motion.div
        className="absolute inset-0 border-4 border-muted rounded-full"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Barras de carregamento - simulando um gráfico de barras */}
      <div className="absolute inset-0 flex items-center justify-center gap-2">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="w-3 bg-primary rounded-t-md"
            initial={{ height: 10, y: 30 }}
            animate={{
              height: [10, 30 + (index * 5), 10],
              y: [30, 10 - (index * 2), 30]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Círculo de progresso */}
      <motion.div
        className="absolute inset-0 border-4 border-l-primary border-t-primary border-r-transparent border-b-transparent rounded-full"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Preload;
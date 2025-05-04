// src/components/ui/preload.tsx 
"use client";

import React from "react";
import { motion } from "framer-motion";

interface PreloadProps {
  isLoading: boolean;
  loadingText?: string; // New optional prop for custom loading text
}

const Preload: React.FC<PreloadProps> = ({ isLoading, loadingText = "Carregando..." }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop com fundo desfocado */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md" />

      {/* Conteúdo central */}
      <div className="relative z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-10 rounded-xl">
        {/* Gráfico de carregamento */}
        <LineChartLoader />

        {/* Texto de carregamento - agora usando o prop loadingText */}
        <p className="mt-6 text-xl font-medium text-foreground/80">{loadingText}</p>
      </div>
    </div>
  );
};

// Componente de gráfico de linhas
const LineChartLoader: React.FC = () => {
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Círculo de fundo */}
      <motion.div
        className="absolute inset-0 border-4 border-muted rounded-full"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Gráfico de linhas animado */}
      <svg width="120" height="80" viewBox="0 0 120 80" className="overflow-visible">
        {/* Eixos X e Y */}
        <motion.line
          x1="0" y1="80" x2="120" y2="80"
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        <motion.line
          x1="0" y1="0" x2="0" y2="80"
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Linha de dados animada */}
        <motion.path
          d="M0,80 C20,50 40,60 60,30 S100,20 120,40"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Pontos de dados */}
        {[
          { x: 0, y: 80 },
          { x: 30, y: 50 },
          { x: 60, y: 30 },
          { x: 90, y: 20 },
          { x: 120, y: 40 }
        ].map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="hsl(var(--primary))"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: index * 0.2,
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 1.5 - (index * 0.2)
            }}
          />
        ))}
      </svg>

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

// Alternativa: Componente de gráfico de pizza
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PieChartLoader: React.FC = () => {
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Círculo de fundo */}
      <div className="absolute inset-0 border-4 border-muted rounded-full" />

      {/* Gráfico de pizza animado */}
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="hsl(var(--primary))"
          strokeWidth="15"
          strokeDasharray="251.2"
          strokeDashoffset="251.2"
          strokeLinecap="round"
          animate={{
            strokeDashoffset: [251.2, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop"
          }}
          style={{ transformOrigin: 'center' }}
        />

        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="15"
          strokeDasharray="251.2"
          strokeDashoffset="188.4" // 75% de 251.2
          strokeLinecap="round"
          animate={{
            rotate: [0, -360]
          }}
          transition={{
            duration: 5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop"
          }}
          style={{ transformOrigin: 'center' }}
        />
      </svg>

      {/* Texto de percentual no centro */}
      <motion.div
        className="absolute text-xl font-bold text-primary"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        75%
      </motion.div>
    </div>
  );
};

export default Preload;
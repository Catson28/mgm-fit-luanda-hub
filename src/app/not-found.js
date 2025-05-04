// src/app/not-found.tsx
"use client"
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 relative">
      {/* Elementos decorativos animados */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-400 opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 30 + 10}px`,
              height: `${Math.random() * 30 + 10}px`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Número 404 animado */}
      <motion.h1
        className="text-9xl font-extrabold text-blue-600 mb-6 tracking-widest"
        initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          scale: isVisible ? 1 : 0.5,
          rotateY: isVisible ? 0 : 90
        }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        404
      </motion.h1>

      {/* Título com animação de aparecer */}
      <motion.h2
        className="text-2xl font-bold mb-4 text-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        Página não encontrada
      </motion.h2>

      {/* Texto com animação de aparecer */}
      <motion.p
        className="mb-6 text-gray-600 text-center max-w-md px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        A página que você está procurando não existe ou foi movida para outro lugar.
      </motion.p>

      {/* Botão com animação de pulsar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg flex items-center space-x-2"
        >
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            animate={{ x: [0, -4, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
          >
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </motion.svg>
          <span>Voltar para a página inicial</span>
        </Link>
      </motion.div>
    </div>
  );
}
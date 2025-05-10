
import React from 'react';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="relative bg-black min-h-screen flex items-center">
      <div
        className="absolute inset-0 bg-black opacity-60 z-10"
      >

        <Image fill
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
          alt="Texto da imagem"
          className="object-cover"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-black mb-4 text-white text-shadow-lg drop-shadow-lg">
            <span className="relative border-b-4 border-mgmred">Transforma o teu corpo,</span> <br />
            <span className="relative border-b-4 border-mgmred">transforma a tua vida</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-mgmblue mb-8 bg-white/80 p-2 inline-block">
            Junte-se à academia que mais cresce em Luanda!
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#pricing" className="btn-primary text-center">Começar</a>
            <a href="#about" className="btn-secondary text-center">Saber mais</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

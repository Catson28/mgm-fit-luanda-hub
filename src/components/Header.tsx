
import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`${isScrolled ? 'sticky-nav' : 'bg-transparent'} py-4 px-6 transition-all duration-300 z-50`}>
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" className="flex items-center">
          <span className="text-2xl font-black font-montserrat">
            <span className="text-mgmred">MGM</span>
            <span className="text-mgmblue">FITNESS</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          <a href="#" className="nav-link font-medium text-gray-900">Início</a>
          <a href="#about" className="nav-link font-medium text-gray-900">Sobre</a>
          <a href="#features" className="nav-link font-medium text-gray-900">Recursos</a>
          <a href="#pricing" className="nav-link font-medium text-gray-900">Preços</a>
          <a href="#blog" className="nav-link font-medium text-gray-900">Blog</a>
          <a href="#contact" className="nav-link font-medium text-gray-900">Contacto</a>
        </nav>

        <div className="hidden md:block">
          <a href="#pricing" className="btn-primary">Inscreva-se agora</a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden py-4 px-6 animate-fade-in z-50">
            <div className="flex flex-col space-y-4">
              <a href="#" className="font-medium text-gray-900" onClick={() => setIsOpen(false)}>Início</a>
              <a href="#about" className="font-medium text-gray-900" onClick={() => setIsOpen(false)}>Sobre</a>
              <a href="#features" className="font-medium text-gray-900" onClick={() => setIsOpen(false)}>Recursos</a>
              <a href="#pricing" className="font-medium text-gray-900" onClick={() => setIsOpen(false)}>Preços</a>
              <a href="#blog" className="font-medium text-gray-900" onClick={() => setIsOpen(false)}>Blog</a>
              <a href="#contact" className="font-medium text-gray-900" onClick={() => setIsOpen(false)}>Contacto</a>
              <a href="#pricing" className="btn-primary w-full text-center" onClick={() => setIsOpen(false)}>Inscreva-se agora</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

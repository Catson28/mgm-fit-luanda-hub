
import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MGM Fitness</h3>
            <p className="text-gray-300 mb-4">
              Transformando corpos e vidas desde 2018. O seu caminho para uma melhor versão de si mesmo começa aqui.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-mgmred transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-mgmred transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-mgmred transition-colors"
                aria-label="FaWhatsapp"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Links rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-mgmred transition-colors">Início</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-mgmred transition-colors">Sobre</a></li>
              <li><a href="#features" className="text-gray-300 hover:text-mgmred transition-colors">Recursos</a></li>
              <li><a href="#pricing" className="text-gray-300 hover:text-mgmred transition-colors">Preços</a></li>
              <li><a href="#blog" className="text-gray-300 hover:text-mgmred transition-colors">Blog</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-mgmred transition-colors">Contacto</a></li>


            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>Samba, Luanda (em frente ao Trirumo)</p>
              <p>
                <a href="tel:+244923456789" className="hover:text-mgmred transition-colors">
                  +244 923 456 789
                </a>
              </p>
              <p>
                <a href="mailto:contacto@mgmfitness.co.ao" className="hover:text-mgmred transition-colors">
                  contacto@mgmfitness.co.ao
                </a>
              </p>
              <p>
                <Link href="/dashboard" className="hover:text-mgmred transition-colors">
                  Admin
                </Link>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-mgmred">© 2025 MGM Fitness Luanda. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import React, { useState } from 'react';
import { Mail, Home, Facebook, Instagram } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData);
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="section bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-mgmblue mb-12 text-center">Contacte-nos</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-fade-in">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 text-mgmred">Informações de contacto</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Home className="text-mgmblue mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Endereço</p>
                    <p className="text-gray-700">Samba, Luanda (em frente ao Trirumo)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="text-mgmblue mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Email</p>
                    <a href="mailto:contacto@mgmfitness.co.ao" className="text-gray-700 hover:text-mgmred">
                      contacto@mgmfitness.co.ao
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaWhatsapp className="text-mgmblue mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Telefone</p>
                    <a href="tel:+244923456789" className="text-gray-700 hover:text-mgmred">
                      +244 923 456 789
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 text-mgmred">Horário</h3>

              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Segunda - Sexta:</div>
                <div>06:00 - 22:00</div>

                <div className="font-medium">Sábado:</div>
                <div>08:00 - 18:00</div>

                <div className="font-medium">Domingo:</div>
                <div>08:00 - 12:00</div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-mgmred">Siga-nos</h3>

              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-mgmblue flex items-center justify-center text-white hover:bg-mgmred transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-mgmblue flex items-center justify-center text-white hover:bg-mgmred transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-mgmblue flex items-center justify-center text-white hover:bg-mgmred transition-colors"
                  aria-label="FaWhatsapp"
                >
                  <FaWhatsapp size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="animate-fade-in">
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-mgmred">
              <h3 className="text-2xl font-bold mb-6 text-center">Envie-nos uma mensagem</h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nome</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mgmblue"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mgmblue"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Telefone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mgmblue"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Mensagem</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mgmblue"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary w-full">Enviar mensagem</button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 h-80 rounded-lg overflow-hidden shadow-md animate-fade-in">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31736.388063486424!2d13.24063!3d-8.83891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f150784d99%3A0x37be4d0c816182a4!2sSamba%2C%20Luanda%2C%20Angola!5e0!3m2!1sen!2sus!4v1651234567890!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="MGM Fitness Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;

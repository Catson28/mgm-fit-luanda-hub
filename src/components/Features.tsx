
import React from 'react';

const features = [
  {
    title: "Formação personalizada",
    description: "Nossos instrutores certificados criam planos de treino personalizados para garantir resultados eficientes.",
    backgroundColor: "bg-mgmblue",
    icon: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Equipamento moderno",
    description: "Dispomos da mais recente tecnologia em equipamentos de fitness para treinos seguros e eficazes.",
    backgroundColor: "bg-mgmred",
    icon: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Ambiente motivador",
    description: "Uma comunidade de apoio, pronta para inspirar e motivar você a alcançar o sucesso que deseja.",
    backgroundColor: "bg-mgmblue",
    icon: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  }
];

const Features = () => {
  return (
    <section id="features" className="section bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-mgmred mb-12 text-center">Porquê escolher a MGM Fitness?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`rounded-lg overflow-hidden shadow-lg animate-fade-in card-hover`}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={feature.icon} 
                  alt={feature.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`${feature.backgroundColor} p-6`}>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

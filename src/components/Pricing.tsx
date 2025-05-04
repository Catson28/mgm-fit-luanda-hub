
import React from 'react';

const plans = [
  {
    name: "Diário",
    price: "1.500 Kz",
    popular: false,
    color: "border-mgmblue",
    buttonColor: "btn-secondary",
    benefits: [
      "Acesso a todas as áreas",
      "Avaliação inicial básica",
      "Plano de treino do dia"
    ]
  },
  {
    name: "Semanal",
    price: "7.000 Kz",
    popular: false,
    color: "border-mgmblue",
    buttonColor: "btn-secondary",
    benefits: [
      "Acesso a todas as áreas",
      "Avaliação física básica",
      "Plano de treino semanal",
      "1 aula em grupo"
    ]
  },
  {
    name: "Mensal",
    price: "25.000 Kz",
    popular: true,
    color: "border-mgmred",
    buttonColor: "btn-primary",
    benefits: [
      "Acesso a todas as áreas",
      "1 sessão de treino personalizado",
      "Avaliação física completa",
      "Plano nutricional básico",
      "Participação ilimitada nas aulas"
    ]
  },
  {
    name: "Anual",
    price: "250.000 Kz",
    popular: false,
    color: "border-mgmblue",
    buttonColor: "btn-secondary",
    benefits: [
      "Acesso a todas as áreas",
      "12 sessões de treino personalizado",
      "Avaliação física trimestral",
      "Plano nutricional completo",
      "Participação ilimitada nas aulas",
      "2 convites para amigos mensais"
    ]
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="section bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-mgmblue mb-12 text-center">Planos e preços</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white p-6 rounded-lg shadow-md ${plan.color} border-t-4 relative animate-fade-in card-hover`}
            >
              {plan.popular && (
                <div className="popular-badge font-bold text-sm">
                  Mais popular
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2 text-center">{plan.name}</h3>
              <div className="text-center mb-6">
                <span className="text-3xl font-black">{plan.price}</span>
              </div>
              
              <ul className="mb-8 space-y-2">
                {plan.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="text-center">
                <a href="#contact" className={`${plan.buttonColor} inline-block w-full`}>Inscrever-se</a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-mgmred animate-fade-in">
          <h3 className="text-xl font-bold mb-4">Planos empresariais</h3>
          <p className="text-gray-700 mb-4">
            Oferecemos pacotes personalizados para empresas que desejam proporcionar benefícios de bem-estar 
            aos seus colaboradores. Descubra como podemos criar um programa adaptado às necessidades da sua equipe.
          </p>
          <a href="#contact" className="btn-primary inline-block">Fale connosco</a>
        </div>
      </div>
    </section>
  );
};

export default Pricing;


import React from 'react';
import Image from 'next/image';

const values = [
  { name: "Excelência", description: "Compromisso com os mais altos padrões em todas as áreas." },
  { name: "Inclusão", description: "Ambiente acolhedor para pessoas de todas as origens e níveis de condicionamento físico." },
  { name: "Comunidade", description: "Construção de uma rede de apoio para motivar e inspirar." },
  { name: "Inovação", description: "Adoção de novos métodos e tecnologias para maximizar o potencial." },
  { name: "Saúde", description: "Promoção do bem-estar físico e mental para uma vida equilibrada." },
  { name: "Responsabilidade", description: "Incentivo à disciplina e comprometimento com objetivos pessoais." }
];

const team = [
  { 
    name: "João Silva", 
    role: "Fundador e CEO", 
    bio: "Mestre em Educação Física com mais de 15 anos de experiência na indústria do fitness.",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
  },
  { 
    name: "Maria Santos", 
    role: "Treinadora Chefe", 
    bio: "Especialista em treino funcional e nutrição com certificações internacionais.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
  },
  { 
    name: "Pedro Costa", 
    role: "Especialista em Reabilitação", 
    bio: "Fisioterapeuta com formação em prevenção e tratamento de lesões desportivas.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
  },
  { 
    name: "Ana Oliveira", 
    role: "Nutricionista", 
    bio: "Especializada em nutrição desportiva e planos alimentares personalizados.",
    image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
  }
];

const About = () => {
  return (
    <section id="about" className="section bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-mgmblue mb-10 text-center">Sobre a MGM Fitness</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold mb-4 text-mgmred">Nossa História</h3>
            <p className="text-gray-700 mb-4">
              Fundada em 2018 por João Silva, a MGM Fitness nasceu com uma visão clara: criar um espaço onde 
              os habitantes de Luanda pudessem transformar seus corpos e vidas através de treino de qualidade e 
              suporte personalizado.
            </p>
            <p className="text-gray-700">
              Hoje, somos orgulhosamente uma instalação de 1.200m² localizada no bairro do Samba, em Luanda, 
              oferecendo o que há de melhor em equipamentos, programas de treino e profissionais qualificados. 
              Nossa missão é inspirar e capacitar todos os membros a alcançarem seu potencial máximo.
            </p>
          </div>
          <div className="h-64 md:h-auto bg-gray-300 rounded-lg overflow-hidden animate-fade-in">
            <Image fill 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Interior da MGM Fitness" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="mb-16 animate-fade-in">
          <h3 className="text-2xl font-bold mb-8 text-mgmred text-center">Nossos Valores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-lg shadow-md ${index % 2 === 0 ? 'border-mgmred' : 'border-mgmblue'} border-t-4 card-hover`}
              >
                <h4 className={`text-xl font-bold mb-2 ${index % 2 === 0 ? 'text-mgmred' : 'text-mgmblue'}`}>{value.name}</h4>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="animate-fade-in">
          <h3 className="text-2xl font-bold mb-8 text-mgmred text-center">Nossa Equipa</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-lg shadow-md ${index % 2 === 0 ? 'border-mgmred' : 'border-mgmblue'} border-b-4 card-hover`}
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image fill 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold text-center mb-1">{member.name}</h4>
                <p className={`text-center mb-3 ${index % 2 === 0 ? 'text-mgmred' : 'text-mgmblue'} font-medium`}>{member.role}</p>
                <p className="text-gray-700 text-center">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

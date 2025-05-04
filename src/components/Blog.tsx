
import React from 'react';
import { ArrowRight } from 'lucide-react';

const posts = [
  {
    title: "Treino de alta intensidade: benefícios e riscos",
    excerpt: "Descubra como o treino de alta intensidade pode transformar seu condicionamento físico, mas também conheça os riscos potenciais.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    author: "Maria Santos",
    date: "10 Abril 2025"
  },
  {
    title: "Como otimizar os ganhos musculares",
    excerpt: "Estratégias comprovadas para maximizar o crescimento muscular através de treino, nutrição e descanso adequado.",
    image: "https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    author: "João Silva",
    date: "28 Março 2025"
  },
  {
    title: "Nutrição para o crescimento muscular",
    excerpt: "Alimentos essenciais e estratégias nutricionais para suportar o desenvolvimento muscular e a recuperação pós-treino.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    author: "Ana Oliveira",
    date: "15 Março 2025"
  }
];

const Blog = () => {
  return (
    <section id="blog" className="section bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-mgmred mb-12 text-center">Dicas e notícias sobre fitness</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg overflow-hidden shadow-md animate-fade-in card-hover"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Por {post.author} · {post.date}
                </p>
                <p className="text-gray-700 mb-4">{post.excerpt}</p>
                <a 
                  href="#" 
                  className="text-mgmblue font-bold flex items-center transition-colors hover:text-mgmred"
                >
                  Ler mais <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;

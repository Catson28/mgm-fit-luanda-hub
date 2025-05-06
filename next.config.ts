// next.config.ts
import withPWA from 'next-pwa';

const pwaConfig = {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    // Outras opções do PWA podem ser adicionadas aqui
};

const nextConfig = {
    images: {
        domains: ['localhost', 'res.cloudinary.com', 'tyulaerp.vercel.app'],
    },   
    typescript: {
      ignoreBuildErrors: true, // Ignora erros do TypeScript no build
    },
    // eslint: {
    //   ignoreDuringBuilds: true, // Ignora o lint no build
    // },
    reactStrictMode: true,
    // Aqui aplicamos o withPWA corretamente
    ...withPWA(pwaConfig)
};

export default nextConfig;
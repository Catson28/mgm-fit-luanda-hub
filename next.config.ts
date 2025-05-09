// next.config.js (usando CommonJS)

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Desativa no ambiente de desenvolvimento
  // disable: false, // Habilita o PWA também no desenvolvimento
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // Cache por 1 ano
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff2?)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // Cache por 30 dias
        },
      },
    },
    {
      urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'jsdelivr-cdn',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 7, // Cache por 7 dias
        },
      },
    },
  ],
});

module.exports = withPWA({
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'tyulaerp.vercel.app', 'images.unsplash.com'],
  },
  // typescript: {
  //     ignoreBuildErrors: true, // Ignora erros do TypeScript no build
  // },
  // eslint: {
  //   ignoreDuringBuilds: true, // Ignora o lint no build
  // },
  reactStrictMode: true, // Ative o modo estrito do React
});

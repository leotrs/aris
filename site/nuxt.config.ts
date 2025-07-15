// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Aris – Web-native scientific publishing',
      meta: [
        { name: 'description', content: 'Aris replaces PDFs with interactive, human-first scientific documents.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        // Open Graph tags for social sharing
        { property: 'og:title', content: 'Aris – Web-native scientific publishing' },
        { property: 'og:description', content: 'Aris replaces PDFs with interactive, human-first scientific documents.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://aris.dev' },
        { property: 'og:image', content: 'https://aris.dev/og-image.png' },
        { property: 'og:site_name', content: 'Aris' },
        // Twitter Card tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Aris – Web-native scientific publishing' },
        { name: 'twitter:description', content: 'Aris replaces PDFs with interactive, human-first scientific documents.' },
        { name: 'twitter:image', content: 'https://aris.dev/og-image.png' },
        // Additional SEO meta tags
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'Aris Team' },
        { name: 'keywords', content: 'scientific publishing, research documents, academic writing, web-native publishing, interactive documents' },
      ],
      link: [
        // Preconnect to Google Fonts for performance
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Source+Sans+3:wght@400;600;700&display=swap', rel: 'stylesheet' },
        // Canonical URL
        { rel: 'canonical', href: 'https://aris.pub' },
        // Favicon
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ]
    },
  },

  css: ['./assets/main.css', './assets/components.css'],
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },

  // Enable image optimization
  image: {
    formats: ['webp', 'avif'],
    quality: 85,
  },

  // Performance optimizations
  experimental: {
    payloadExtraction: false, // Improve initial load time
    
    // Fix for "Failed to fetch dynamically imported module" errors
    // This resolves browser back navigation failures in development and E2E tests
    // When a dynamically imported chunk fails to load (common during dev server restarts
    // or browser back navigation), Nuxt will automatically reload the page instead of 
    // showing a broken state. This fixes timeouts in Firefox E2E tests where pages
    // never load due to failed chunk imports.
    // See: https://github.com/nuxt/nuxt/issues/26565
    emitRouteChunkError: 'reload',
  },

  modules: ['@nuxt/image'],

  // Compression configuration
  nitro: {
    compressPublicAssets: true, // Enable compression
  },

  // Runtime config for frontend URL
  runtimeConfig: {
    public: {
      frontendUrl: process.env.FRONTEND_URL,
      backendUrl: process.env.NUXT_BACKEND_URL
    }
  },

  // Disable DevTools in test environment
  devtools: { enabled: process.env.NODE_ENV !== 'test' },
})

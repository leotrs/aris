// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Aris – Web-native scientific publishing',
      meta: [
        { name: 'description', content: 'Aris replaces PDFs with interactive, human-first scientific documents.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
      ],
    },
  },
  css: ['./assets/rsm.css', './assets/main.css'],
})

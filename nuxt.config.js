import colors from 'vuetify/es5/util/colors'

export default {
  ssr: false,

  head: {
    titleTemplate: '%s - pdf-word-app',
    title: 'PDF to Word Converter',
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  css: [],

  plugins: [
    { src: '~/plugins/pdfjs.client.js', mode: 'client' }
  ],

  components: true,

  buildModules: ['@nuxtjs/vuetify'],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  auth: {
    redirect: {
      login: '/welcome',
      logout: '/welcome',
      callback: '/callback',
      home: '/home'
    },
    cookie: {
      options: {
        secure: true,
        domain: '.vercel.app'
      }
    },
    strategies: {
      auth0: {
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
        audience: '',
        redirectUri: process.env.AUTH0_REDIRECT_URI,
        logoutRedirectUri: process.env.AUTH0_LOGOUT_REDIRECT_URI,
        scope: ['openid', 'profile', 'email']
      }
    }
  },

  axios: {
    baseURL: '/'
  },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  build: {
    transpile: ['pdfjs-dist'],
    extend(config, ctx) {
      config.module.rules.push({
        test: /pdf\.worker\.js$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash].js',
            publicPath: '/_nuxt/'
          }
        }
      })
    }
  },

  router: {
    middleware: [] // Add ['auth'] if you want all routes protected
  }
}

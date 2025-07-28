<template>
  <v-container
    class="fill-height d-flex justify-center align-center text-center welcome-bg"
  >
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-10 rounded-xl" elevation="12" color="#1a1a1a">
          <h1 class="text-h4 font-weight-bold mb-4 teal--text text--lighten-2">
            📄 PDF to Word Converter
          </h1>
          <p class="mb-6 grey--text text--lighten-1">
            Convert your PDF documents to editable Word files with a single click — fast, simple, and no signup required.
          </p>
          <v-btn color="teal darken-1" large dark @click="start">
            🚀 Let's Start
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods: {
    start() {
      this.$router.push('/convert') // replace with your actual page route
    }
  }
}
</script>

<style scoped>
.welcome-bg {
  background: linear-gradient(135deg, #0d0d0d, #1a1a1a);
}
h1, p {
  text-align: center;
}
</style>

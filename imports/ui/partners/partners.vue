<template>
  <div v-if="data"
       class="row justify-content-center">
    Partners: {{data.length}}
  </div>
</template>

<script>
  export default {
    created() {
      this.$store.dispatch('load_partners')
    },
    computed: {
      data() {
        return this.$store.state.user_partners
      }
    }
  }
</script>

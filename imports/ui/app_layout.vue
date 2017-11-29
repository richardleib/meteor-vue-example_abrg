<template>
  <div class="b-layout">
    <navbar/>
    <router-view/>
  </div>
</template>

<script>
  import '/imports/ui/styles/index'
  import navbar from './navbar.vue'

  export default {
    components: {
      navbar
    },
    computed: {
      user_token() {
        return this.$store.state.user_token
      }
    }
  }
</script>
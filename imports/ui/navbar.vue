<template>
  <b-navbar toggleable="md"
            type="dark"
            variant="dark">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <router-link class="navbar-brand"
                 :to="{ name: 'home' }">_app</router-link>

    <b-collapse is-nav id="nav_collapse">

      <b-navbar-nav v-if="user_token" key="user_tools">
        <router-link class="nav-link"
                     :to="{ name:'partners' }">Partners</router-link>
        <router-link class="nav-link"
                     :to="{ name:'notes' }">Notes</router-link>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <b-nav-item-dropdown v-if="user_token"
                             key="user_profile"
                             right>
          <!-- Using button-content slot -->
          <template slot="button-content">
            User
          </template>

          <router-link class="dropdown-item"
                       :to="{ name:'profile' }">Profile</router-link>

          <router-link class="dropdown-item"
                       :to="{ name:'update_password' }">Change password</router-link>

          <b-dropdown-item href="#"
                           @click.prevent="sing_out">Sign out</b-dropdown-item>
        </b-nav-item-dropdown>

        <template v-else>
          <router-link class="nav-link"
                       :to="{ name:'reset_password' }">Reset password</router-link>

          <router-link class="nav-link"
                       :to="{ name:'register' }">Register</router-link>

          <router-link class="nav-link"
                       :to="{ name:'sign_in' }">Sign in</router-link>
        </template>
      </b-navbar-nav>

    </b-collapse>
  </b-navbar>
</template>

<script>
  export default {
    computed: {
      user_token() {
        return this.$store.state.user_token
      }
    },
    methods: {
      sing_out() {
        // Remove user token
        this.$store.dispatch('clean_user_data')

        // Show notification
        this.$notify({
          group: 'notifications',
          title: 'Good bye!',
          text: 'You have been signed out'
        })

        // Proceed to home page
        this.$router.push({name: 'home'}, () => window.scrollTo(0,0))
      }
    }
  }
</script>
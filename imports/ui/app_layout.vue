<template>
  <div class="b-layout">
    <div class="container">
      <ul class="nav nav-pills justify-content-center">
        <li class="nav-item">
          <router-link class="nav-link"
                       :to="{ name:'register' }">Register</router-link>
        </li>

        <li class="nav-item">
          <router-link class="nav-link"
                       :to="{ name:'another' }">Another Page</router-link>
        </li>
      </ul>

      <router-view/>
    </div>
  </div>
</template>

<script>
  import '/imports/ui/styles/index'

  import { Meteor } from 'meteor/meteor'

  export default {}
</script>
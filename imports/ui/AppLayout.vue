<template>
  <div class="app-layout">
    <nav>
      <router-link :to="{ name:'home' }">Home</router-link>
      <router-link :to="{ name:'another' }">Another Page</router-link>
    </nav>
    <router-view class="main-router"></router-view>
  </div>
</template>

<script>
import {Meteor} from 'meteor/meteor';

export default {

}
</script>

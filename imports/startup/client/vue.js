// Libs
import { Meteor } from 'meteor/meteor'
import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)

// import VueMeteorTracker from 'vue-meteor-tracker'
// Vue.use(VueMeteorTracker)

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import Notifications from 'vue-notification'
Vue.use(Notifications)

import VueAutosize from 'vue-autosize'
Vue.use(VueAutosize)

import routes from '/imports/startup/client/routes'
import store from '/imports/startup/client/vuex'
import app_layout from '/imports/ui/app_layout.vue'

const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior: function (to, from, savedPosition){
    //your scroll behavior
  },
  linkActiveClass: 'active',
  linkExactActiveClass: 'active'
});

// App start
Meteor.startup(() => {
  new Vue({
    store,
    router,
    el: '#app',
    render: h => h(app_layout)
  })
});

// Libs
import { Meteor } from 'meteor/meteor'
import Vue from 'vue'
import VueRouter from 'vue-router'
// import VueMeteorTracker from 'vue-meteor-tracker'
import BootstrapVue from 'bootstrap-vue'
import Notifications from 'vue-notification'
import VueAutosize from 'vue-autosize'
import AsyncComputed from 'vue-async-computed'
import routes from '/imports/startup/client/routes'
import store from '/imports/startup/client/vuex'
import app_layout from '/imports/ui/app_layout.vue'

Vue.use(VueRouter)
// Vue.use(VueMeteorTracker)
Vue.use(BootstrapVue)
Vue.use(Notifications)
Vue.use(VueAutosize)
Vue.use(AsyncComputed)

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

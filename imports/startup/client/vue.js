// Libs
import { Meteor } from 'meteor/meteor'
import Vue from 'vue'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import Notifications from 'vue-notification'
import routes from '/imports/startup/client/routes'
import store from '/imports/startup/client/vuex'
import VueMeteorTracker from 'vue-meteor-tracker'
import app_layout from '/imports/ui/app_layout.vue'

Vue.use(VueMeteorTracker)
Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(Notifications)

const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior: function (to, from, savedPosition){
    //your scroll behavior
  },
  // linkActiveClass: 'active-parent'
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

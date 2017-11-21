// Libs
import {Meteor} from 'meteor/meteor'
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '/imports/routes'
import store from '/imports/vuex/store'
import VueMeteorTracker from 'vue-meteor-tracker'
import AppLayout from '/imports/ui/AppLayout.vue'

Vue.use(VueMeteorTracker);
Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior: function (to, from, savedPosition){
    //your scroll behavior
  }
});

// App start
Meteor.startup(() => {
  new Vue({
    store,
    router,
    el: '#app',
    render: h => h(AppLayout)
  })
});

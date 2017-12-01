import store from '/imports/startup/client/vuex'

// Import components
import home from '/imports/ui/home.vue'
import not_found from '/imports/ui/not_found.vue'
import not_authorised from '/imports/ui/not_authorised.vue'
// Lazy import
register = () => import('/imports/ui/user/register.vue')
sign_in = () => import('/imports/ui/user/sign_in.vue')
profile = () => import('/imports/ui/user/profile.vue')
update_password = () => import('/imports/ui/user/update_password.vue')
reset_password = () => import('/imports/ui/user/reset_password.vue')
partners = () => import('/imports/ui/partners/partners.vue')
another = () => import('/imports/ui/another.vue')

let is_authorised = store.getters.is_authorised

export default [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
  {
    path: '/sign_in',
    name: 'sign_in',
    component: sign_in
  },
  {
    path: '/profile',
    name: 'profile',
    component: !is_authorised ? not_authorised : profile
  },
  {
    path: '/update-password',
    name: 'update_password',
    component: !is_authorised ? not_authorised : update_password
  },
  {
    path: '/reset-password',
    name: 'reset_password',
    component: reset_password
  },
  {
    path: '/partners',
    name: 'partners',
    component: !is_authorised ? not_authorised : partners
  },
  {
    path: '/another',
    name: 'another',
    component: another
  },
  {
    path: '*',
    component: not_found
  }
];

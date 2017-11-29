// Import components
import home from '/imports/ui/home.vue'
import not_found from '/imports/ui/not_found.vue'
// import another from '/imports/ui/another.vue'
// import register from '/imports/ui/user/register.vue'
// import sign_in from '/imports/ui/user/sign_in.vue'
// import profile_update from '/imports/ui/user/update.vue'

register = () => import('/imports/ui/user/register.vue')
sign_in = () => import('/imports/ui/user/sign_in.vue')
profile_update = () => import('/imports/ui/user/update.vue')
another = () => import('/imports/ui/another.vue')

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
    path: '/profile/update',
    name: 'update',
    component: profile_update
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

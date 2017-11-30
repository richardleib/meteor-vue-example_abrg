// Import components
import home from '/imports/ui/home.vue'
import not_found from '/imports/ui/not_found.vue'

register = () => import('/imports/ui/user/register.vue')
sign_in = () => import('/imports/ui/user/sign_in.vue')
profile = () => import('/imports/ui/user/profile.vue')
update_password = () => import('/imports/ui/user/update_password.vue')
reset_password = () => import('/imports/ui/user/reset_password.vue')
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
    path: '/profile',
    name: 'profile',
    component: profile
  },
  {
    path: '/update-password',
    name: 'update_password',
    component: update_password
  },
  {
    path: '/reset-password',
    name: 'reset_password',
    component: reset_password
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

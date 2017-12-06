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
notes = () => import('/imports/ui/notes/notes.vue')
another = () => import('/imports/ui/another.vue')

function check_authentication(to, from, next) {
  if (!store.getters.is_authorised) {
    next({name: 'not_authorised'})
  }
  console.log('routes - load_user - auth')
  next()
}

export default [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/not-authorised',
    name: 'not_authorised',
    component: not_authorised
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
  {
    path: '/sign-in',
    name: 'sign_in',
    component: sign_in
  },
  {
    path: '/profile',
    name: 'profile',
    beforeEnter: check_authentication,
    component: profile
  },
  {
    path: '/update-password',
    name: 'update_password',
    beforeEnter: check_authentication,
    component: update_password
  },
  {
    path: '/reset-password',
    name: 'reset_password',
    component: reset_password
  },
  {
    path: '/partners',
    name: 'partners',
    beforeEnter: check_authentication,
    component: partners
  },
  {
    path: '/notes',
    name: 'notes',
    beforeEnter: check_authentication,
    component: notes,
    children: [
      {
        path: 'create',
        name: 'create_note',
        beforeEnter: check_authentication,
        component: notes
      },
      {
        path: 'id/:_id',
        name: 'note',
        beforeEnter: check_authentication,
        component: notes
      },
      {
        path: 'id/:_id/edit',
        name: 'edit_note',
        beforeEnter: check_authentication,
        component: notes
      }
    ]
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

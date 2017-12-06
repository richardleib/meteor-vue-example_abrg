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

// Load user data to check if current user token is valid on server
async function is_authorised() {
  return await store.dispatch('load_user')
}

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
    component: !is_authorised() ? not_authorised : profile
  },
  {
    path: '/update-password',
    name: 'update_password',
    component: !is_authorised() ? not_authorised : update_password
  },
  {
    path: '/reset-password',
    name: 'reset_password',
    component: reset_password
  },
  {
    path: '/partners',
    name: 'partners',
    component: !is_authorised() ? not_authorised : partners
  },
  {
    path: '/notes',
    name: 'notes',
    component: !is_authorised() ? not_authorised : notes,
    children: [
      {
        path: 'create',
        name: 'create_note',
        component: !is_authorised() ? not_authorised : notes
      },
      {
        path: 'id/:_id',
        name: 'note',
        component: !is_authorised() ? not_authorised : notes
      },
      {
        path: 'id/:_id/edit',
        name: 'edit_note',
        component: !is_authorised() ? not_authorised : notes
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

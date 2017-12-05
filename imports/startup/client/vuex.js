import Vue from 'vue'
import Vuex from 'vuex'
import { Meteor } from 'meteor/meteor'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    window_width: window.innerWidth,
    user_token: localStorage.getItem('user_token'),
    user: null,
    user_partners: null
  },
  getters: {
    is_authorised: state => !!state.user_token,
    schema_items: state => schema => {
      return schema._schema
    },
    schema_items_array: (state, getters) => schema => {
      // Get schema items
      let schema_items = getters.schema_items(schema)

      // Reformat object to array, add schema item name
      schema_items = Object.entries(schema_items).map(([key, value]) => {
        return {
          name: key,
          ...value
        }
      })

      return schema_items
    }
  },
  mutations: {
    window_width(state, width) {
      state.window_width = width
    },
    set_user_token(state, param) {
      state.user_token = param
      localStorage.setItem('user_token', state.user_token)
    },
    remove_user_token(state) {
      state.user_token = '' // localStorage stores strings
      localStorage.setItem('user_token', state.user_token)
    },
    set_user(state, param) {
      state.user = param
    },
    remove_user(state) {
      state.user = null
    },
    set_user_partners(state, param) {
      state.user_partners = param
    },
    remove_user_partners(state) {
      state.user_partners = null
    }
  },
  actions: {
    load_user({ commit, state }) {
      let user_token = state.user_token
      console.log('load_user - user_token:', user_token)

      if (!user_token) {
        return false
      }

      Meteor.callAsync('method__user_load', user_token)
        .then(result => {
          console.log('method__user_load - result:', result)

          commit('set_user', result)

          return result
        })
        .catch(error => {
          console.error('method__user_load - error:', error)

          return error
        })
    },
    clean_user_data({ commit, state }) {
      commit('remove_user_token')
      commit('remove_user')
      commit('remove_user_partners')
    }
  }
})

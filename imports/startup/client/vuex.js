import Vue from 'vue'
import Vuex from 'vuex'
import { Meteor } from 'meteor/meteor'
import object_value from '/imports/api/helpers/object_value'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    window_width: window.innerWidth,
    reactive_route: null,
    user_token: localStorage.getItem('user_token'),
    user: null,
    notes: null
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
    },
    current_note: (state, getters) => {
      let id = object_value(state, 'reactive_route.params._id')

      if (!id) {
        return false
      }

      console.log('vuex - current_note - state.notes:', state.notes)

      return state.notes.find(obj => obj._id === id)
    }
  },
  mutations: {
    set_window_width(state, width) {
      state.window_width = width
    },
    set_reactive_route(state, route) {
      state.reactive_route = route
    },
    set_user_token(state, data) {
      state.user_token = data
      localStorage.setItem('user_token', state.user_token)
    },
    remove_user_token(state) {
      state.user_token = '' // localStorage stores strings
      localStorage.setItem('user_token', state.user_token)
    },
    set_user(state, data) {
      state.user = data
    },
    remove_user(state) {
      state.user = null
    },
    set_notes(state, data) {
      state.notes = data
    },
    remove_notes(state) {
      state.notes = null
    }
  },
  actions: {
    load_user({ commit, state }) {
      let user_token = state.user_token
      console.log('load_user - user_token:', user_token)

      if (!user_token) {
        return false
      }

      return Meteor.callAsync('method__user_load', user_token)
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
      commit('remove_notes')
    },
    load_notes({ commit, state }, search_query = {}) {
      const user_token = state.user_token

      return Meteor.callAsync('method__notes_load', { search_query, user_token })
        .then(result => {
          console.log('method__notes_load - result:', result)

          commit('set_notes', result)

          return result
        })
        .catch(error => {
          console.error('method__notes_load - error:', error)

          return error
        })

      // console.log('fetch_data - response:', response)
      // return response
    },
    generate_notes({ commit, state }, {vue, amount}) {
      let user_token = state.user_token

      return Meteor.callAsync('method__notes_generate', amount, user_token)
        .then(result => {
          console.log('method__notes_generate - result:', result)

          // Reload
          this.dispatch('load_notes')

          // Show notification
          vue.$notify({
            group: 'notifications',
            title: 'Success',
            text: `We generated ${amount} notes for you`
          })

          return result
        })
        .catch(error => {
          console.error('method__notes_load - error:', error)

          // Set error message
          let message = object_value(error, 'error', 'Error')

          // Show notification
          vue.$notify({
            group: 'notifications',
            title: 'Error',
            text: message
          })

          return error
        })
    }
  }
})

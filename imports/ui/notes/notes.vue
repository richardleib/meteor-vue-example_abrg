<template>
  <b-container fluid>
    <b-row no-gutters>
      <b-col v-if="$store.state.window_width >= 576 || this.route.name === 'notes'"
             class="b-scrollable-container pr-sm-3"
             sm="4"
             offset-lg="2" lg="3">
        <router-link class="btn btn-primary align-self-start mb-3"
                     :to="{ name: 'create_note' }">Add note</router-link>
        <div v-if="notes"
             class="b-notes-list b-scrollable-main">
          <notes__list__item v-for="(note, index) of notes"
                             :sort="note.dateCreated"
                             :key="index"
                             :note="note"/>
        </div>
      </b-col>
      <b-col v-if="$store.state.window_width >= 576 || route.name !== 'notes'"
             class="b-scrollable-container"
             sm="8"
             lg="5">
        <notes__note v-if="route.name === 'note' && current_note"
                     :note="current_note"/>
        <notes__create_note v-else-if="route.name === 'create_note'"/>
        <notes__update_note v-else-if="route.name === 'edit_note' && current_note"
                            :note="current_note"/>
        <div v-else
             class="b-form d-flex flex-wrap justify-content-center align-items-baseline">
          Select or
          <router-link class="btn btn-outline-primary ml-2"
                       :to="{ name: 'create_note' }">Add note</router-link>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { Meteor } from 'meteor/meteor'
  import object_value from '/imports/api/helpers/object_value'
  import notes__list__item from './notes__list__item'
  import notes__create_note from './notes__create_note'
  import notes__update_note from './notes__update_note'
  import notes__note from './notes__note'

  export default {
    components: {
      notes__list__item,
      notes__create_note,
      notes__update_note,
      notes__note
    },
    asyncComputed: {
      async notes() {
        let fetched = await this.fetch_data()
        console.log('fetched:', object_value(fetched, 'data'))
        return object_value(fetched, 'data')
      },
      async current_note() {
        let id = object_value(this, 'route.params._id')

        if (!id) {
          return false
        }

        let fetched_data = await this.fetch_data({ id })
        let note = object_value(fetched_data, 'data')
        // console.log('notes.vue - current_note:', note)

        return note
      }
    },
    computed: {
      route() {
        return this.$store.state.reactive_route
      }
    },
    methods: {
      async fetch_data(search_query = {}) {
        // console.log('fetch_data:', ...arguments)

        const user_token = this.$store.state.user_token

        let response = {}

        // Direct Meteor method call, no Vuex store and methods here
        return await Meteor.callAsync('method__notes_load', { search_query, user_token })
          .then(result => {
            console.log('method__notes_load - result:', result)

            return result
          })
          .catch(error => {
            console.error('method__notes_load - error:', error)

            // Set error message
            let message = object_value(error, 'error', 'Error')
            this.action_error = message

            // Show notification
            this.$notify({
              group: 'notifications',
              title: 'Not fetched',
              text: message
            })

            return error
          })

        // console.log('fetch_data - response:', response)
        // return response
      }
    }
  }
</script>

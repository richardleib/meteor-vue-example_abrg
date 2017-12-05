<template>
  <b-container fluid>
    <b-row no-gutters>
      <template v-if="notes">
        <b-col v-if="window_width >= 576 || route.name === 'notes'"
               class="b-scrollable-container pr-sm-3"
               sm="4"
               offset-lg="2" lg="3">

          <div class="d-flex align-items-baseline justify-content-between flex-wrap">
            <b-button size="sm"
                      variant="outline-primary"
                      @click="reload()">Reload</b-button>
            <router-link class="btn btn-primary btn-sm align-self-start mb-3"
                         :to="{ name: 'create_note' }">Add note</router-link>
          </div>

          <div v-if="notes"
               class="b-notes-list b-scrollable-main">
            <notes__list__item v-for="(note, index) of notes"
                               :sort="note.dateCreated"
                               :key="index"
                               :note="note"/>
          </div>
        </b-col>
        <b-col v-if="window_width >= 576 || route.name !== 'notes'"
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
      </template>
      <b-col v-else
             sm="4"
             offset-lg="2" lg="3">
        Loading...
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
    created() {
      this.$store.dispatch('load_notes')
    },
    computed: {
      route() {
        return this.$store.state.reactive_route
      },
      window_width() {
        return this.$store.state.window_width
      },
      notes() {
        return this.$store.state.notes
      },
      current_note() {
        return this.$store.getters.current_note
      }
    },
    methods: {
      reload() {
        this.$store.dispatch('load_notes')
      }
    }
  }
</script>

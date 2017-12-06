<template>
  <div class="b-notes-note b-scrollable-main">
    <h2>{{note.title || '[Untitled]'}}</h2>
    <router-link class="b-notes-note-close close p-2 d-sm-none"
                 :to="{ name: 'notes' }">
      <span aria-hidden="true">&times;</span>
    </router-link>
    <hr>
    <div class="d-flex align-items-baseline justify-content-between flex-wrap">
      <b-badge v-if="date"
               variant="light">{{date}}</b-badge>
      <b-button-group>
        <b-button size="sm"
                  variant="outline-primary"
                  @click="edit_note()">Edit</b-button>
        <b-button size="sm"
                  variant="outline-primary"
                  @click="delete_note()">Delete</b-button>
      </b-button-group>
    </div>
    <hr>
    <div class="b-notes-note-body" v-html="note_body"></div>
  </div>
</template>

<script>
  import moment from 'moment'
  import object_value from '/imports/api/helpers/object_value'
  import strip_text from '/imports/api/helpers/strip_text'

  export default {
    props: ['note'],
    created() {
      this.$store.dispatch('load_notes')
    },
    computed: {
      date() {
        return moment(this.note.dateCreate).calendar()
      },
      note_body() {
        let text = object_value(this, 'note.body', '<em>[Empty]</em>')
        return strip_text({text})
      }
    },
    methods: {
      edit_note() {
        this.$router.push({name: 'edit_note', params: {_id: this.note._id}})
      },
      async delete_note() {
        if (!confirm('Delete?')) {
          return false
        }

        let id = this.note._id
        let user_token = this.$store.state.user_token

        Meteor.callAsync('method__note_delete', { id }, user_token)
          .then(result => {
            console.log('method__note_delete - result:', result)

            this.$store.dispatch('load_notes')

            return result
          })
          .catch(error => {
            console.error('method__note_delete - error:', error)

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
      }
    }
  }
</script>

<template>
  <router-link class="b-notes-list-item"
               :to="{ name: 'note', params: {_id: note._id} }">
    <span class="b-notes-list-item-title">{{note.title || '[Untitled]'}}</span>
    <span class="b-notes-list-item-body"
          v-html="note_body"></span>
  </router-link>
</template>

<script>
  import $ from 'jquery'
  import object_value from '/imports/api/helpers/object_value'
  import strip_text from '/imports/api/helpers/strip_text'

  export default {
    props: ['note'],
    mounted() {
      this.scroll()
    },
    computed: {
      is_current() {
        return this.$router.currentRoute.params._id === this.note._id
      },
      note_body() {
        let text = object_value(this, 'note.body', '[Empty]')
        return strip_text({text, limit: 140})
      }
    },
    methods: {
      scroll() {
        if (this.is_current) {
          const instance = this
          const position_to = instance.$el.offsetTop

          if ( typeof position_to === "undefined" ) {
            return false
          }

          $( instance.$el.offsetParent ).animate({ scrollTop: position_to }, 200)
        }
      }
    }
  }
</script>

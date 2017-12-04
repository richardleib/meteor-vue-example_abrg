<template>
  <router-link class="b-notes-list-item"
               :to="{ name: 'note', params: {_id: note._id} }">
    <span class="b-notes-list-item-title">{{note.title || '[Untitled]'}}</span>
    <span class="b-notes-list-item-body"
          v-html="note_body"></span>
  </router-link>
</template>

<script>
  import striptags from 'striptags'
  import string_prune from 'underscore.string/prune'
  import object_value from '/imports/api/helpers/object_value'

  export default {
    props: ['note'],
    computed: {
      note_body() {
        function clear_snippet_text(text) {
          if (!text) {
            return;
          }
          text = striptags(text, ['p']);
          return (text + '')
          // Remove double line breaks
            .replace(/\n{2,}/g, '\n')
            // Remove all type of double spaces
            .replace(/(\s)+/g, ' ') //.replace(/ +/g, ' ')
            // Replace all type of new lines
            .replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2')
            // Remove codes
            .replace(/(&nbsp;)/gm,"")
        }

        let note_body = object_value(this, 'note.body', '[Empty]')
        let snippet_text = clear_snippet_text( note_body )

        return string_prune( snippet_text, 140)
      }
    }
  }
</script>

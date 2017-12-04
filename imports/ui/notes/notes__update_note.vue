<template>
  <form_constructor :schema="schema"
                    form_class="b-form"
                    form_name="update_note"
                    form_title="Update note"
                    :form_loaded_data="filter_data"/>
</template>

<script>
  import form_constructor from '/imports/ui/form_constructor/form.vue'
  import { schema__note_update } from '/imports/api/notes/schemas'

  export default {
    components: {
      form_constructor
    },
    props: ['note'],
    data() {
      return {
        filter_data: null
      }
    },
    created() {
      this.filter_data = {
        id: this.note._id,
        title: this.note.title,
        body: this.note.body
      }
    },
    computed: {
      schema() {
        return schema__note_update
      }
    }
  }
</script>

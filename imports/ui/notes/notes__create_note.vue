<template>
  <form_constructor :schema="schema"
                    form_class="b-form"
                    form_name="create_note"
                    form_title="New note"/>
</template>

<script>
  import form_constructor from '/imports/ui/form_constructor/form.vue'
  import { schema__note_create } from '/imports/api/notes/schemas'

  export default {
    components: {
      form_constructor
    },
    computed: {
      schema() {
        return schema__note_create
      }
    }
  }
</script>

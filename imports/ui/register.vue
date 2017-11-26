<template>
  <form_constructor :schema="schema"/>
</template>

<script>
  import form_constructor from '/imports/ui/form.vue'
  import { schema__user_create } from '/imports/api/schemas'

  export default {
    components: {
      form_constructor
    },
    computed: {
      schema() {
        return schema__user_create
      }
    }
  }
</script>

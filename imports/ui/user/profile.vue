<template>
  <div class="row justify-content-center">
    <form_constructor :schema="schema"/>
  </div>
</template>

<script>
  import form_constructor from '/imports/ui/form_constructor/form.vue'
  import { schema__user_update } from '/imports/api/user/schemas'

  export default {
    components: {
      form_constructor
    },
    computed: {
      schema() {
        return schema__user_update
      }
    }
  }
</script>

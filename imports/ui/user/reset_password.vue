<template>
  <div class="row justify-content-center">
    <form_constructor :schema="schema"
                      form_name="reset_password"
                      form_title="Reset password"/>
  </div>
</template>

<script>
  import form_constructor from '/imports/ui/form_constructor/form.vue'
  import { schema__password_reset } from '/imports/api/user/schemas'

  export default {
    components: {
      form_constructor
    },
    computed: {
      schema() {
        return schema__password_reset
      }
    }
  }
</script>

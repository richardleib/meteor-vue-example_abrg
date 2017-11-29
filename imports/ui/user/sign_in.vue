<template>
  <div class="row justify-content-center">
    <form_constructor :schema="schema"
                      form_title="Sign in"/>
  </div>
</template>

<script>
  import form_constructor from '/imports/ui/form_constructor/form.vue'
  import { schema__user_login } from '/imports/api/schemas'

  export default {
    components: {
      form_constructor
    },
    computed: {
      schema() {
        return schema__user_login
      }
    }
  }
</script>

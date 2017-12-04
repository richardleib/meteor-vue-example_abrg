<template>
  <div class="row justify-content-center">
    <form_constructor :schema="schema"
                      form_class="b-form b-form_small"
                      form_name="register"
                      form_title="Register a new user"/>
  </div>
</template>

<script>
  import form_constructor from '/imports/ui/form_constructor/form.vue'
  import { schema__user_create } from '/imports/api/user/schemas'

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

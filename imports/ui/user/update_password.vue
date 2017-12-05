<template>
  <div class="row justify-content-center">
    <form_constructor :schema="schema"
                      form_class="b-form b-form_small"
                      form_name="update_password"
                      form_title="Update password"/>
  </div>
</template>

<script>
  import form_constructor from '/imports/ui/form_constructor/form.vue'
  import { schema__password_update } from '/imports/api/user/schemas'

  export default {
    components: {
      form_constructor
    },
    created() {
      this.$store.dispatch('load_user')
    },
    computed: {
      schema() {
        return schema__password_update
      }
    }
  }
</script>

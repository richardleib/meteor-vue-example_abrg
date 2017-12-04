<template>
  <div class="row justify-content-center">
    <form_constructor v-if="data"
                      :schema="schema"
                      form_class="b-form b-form_small"
                      form_name="user"
                      form_title="Your profile"
                      :form_loaded_data="data"
                      :form_toggle_edit=true />
    <form__loading v-else />
  </div>
</template>

<script>
  import form_constructor from '/imports/ui/form_constructor/form.vue'
  import form__loading from '/imports/ui/form_constructor/form__loading.vue'
  import { schema__user_update } from '/imports/api/user/schemas'

  export default {
    components: {
      form_constructor,
      form__loading
    },
    created() {
      this.$store.dispatch('load_user')
    },
    computed: {
      schema() {
        return schema__user_update
      },
      data() {
        return this.$store.state.user
      }
    }
  }
</script>

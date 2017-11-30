<template>
  <div class="row justify-content-center">
    <form_constructor v-if="data"
                      :schema="schema"
                      form_name="user"
                      :form_loaded_data="data"/>
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

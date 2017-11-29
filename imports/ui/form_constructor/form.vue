<template>
  <form class="b-form"
        @input="validate_form"
        @submit.prevent="submit_form"
        novalidate>

    <template v-if="form_title">
      <h2>{{form_title}}</h2>
      <hr>
    </template>

    <fieldset :disabled="action_running">
      <template v-if="route_name === 'register'">
        <button class="btn btn-primary btn-sm"
                type="button"
                @click="generate_demo_values()">Insert demo values
        </button>

        <hr>
      </template>

      <form__item v-for="(item, index) of schema_items_array"
                  :key="index"
                  :item="item"
                  :validation_error="validation_error(item.name)"
                  :value="form_data[item.name]"
                  @input="value => process_input(value, item.name)"/>

      <b-alert variant="danger"
               :show="action_error">
        <strong>Not submitted</strong><br>
        <small v-html="action_error"></small>
      </b-alert>

      <footer class="b-form-footer d-flex align-items-baseline">

        <button class="col-auto btn btn-primary"
                :disabled="!allow_submit">Submit</button>

        <div class="col"
             v-if="!allow_submit && !action_running && !action_error">Fill the form, please.</div>

        <div class="col"
             v-if="action_running">Submitting...</div>
      </footer>

    </fieldset>

  </form>
</template>

<script>
  import { Meteor } from 'meteor/meteor'
  import Random from 'random-js'
  import object_value from '/imports/api/helpers/object_value'
  import form__item from './form__item.vue'

  export default {
    components: {
      form__item
    },
    props: ['schema', 'form_title'],
    data() {
      return {
        route_name: null,
        form_data: {},
        form_is_valid: true,
        form_validation_errors: [],
        show_form_validation_error: [],
        action_running: false,
        action_error: false
      }
    },
    created() {
      //console.log( this.schema_items )

      // Set initial values
      Object.entries( this.schema_items ).map(([key, value]) => {
        this.form_data[key] = object_value(value, 'form.value', null)
      })
    },
    mounted() {
      let route = this.$router.currentRoute
      this.route_name = route.name

      this.validate_form()
    },
    watch: {
      form_data(value, old_value) {
        console.log('watch form_data - value, old_value:', value, old_value)
      }
    },
    computed: {
      user_token() {
        console.log('user_token:', this.$store.state.user_token)
        return this.$store.state.user_token
      },
      schema_items() {
        return this.$store.getters.schema_items( this.schema )
      },
      schema_items_array() {
        return this.$store.getters.schema_items_array( this.schema )
      },
      allow_submit() {
        return this.form_is_valid && !this.action_running && !this.action_error
      },
    },
    methods: {
      object_value() {
        return object_value(...arguments)
      },
      generate_demo_values() {
        let un = Random.hex()( Random.engines.nativeMath, 8 )

        this.form_data = {
          "sponsor": "testareg1",
          "username": un,
          "email": "id0+" + un + "@posteo.net",
          "firstName": "Mickey",
          "secondName": "Mouse",
          "password": "pass_" + un,
          "finPassword": "finPass_" + un,
          "country": "ru",
          "phone": "78120001122"
        }

        this.validate_form()
      },
      validate_form() {
        let validationContext = this.schema.newContext()
        validationContext.validate( this.form_data )

        this.form_is_valid = validationContext.isValid()
        this.form_validation_errors = validationContext.validationErrors()
        this.action_error = false
      },
      validation_error(name) {
        if ( !this.show_form_validation_error.find(i => i === name) ) {
          return undefined
        }

        return this.form_validation_errors.find(o => o.name === name)
      },
      show_form_validation_error__clean() {
        this.show_form_validation_error = []
      },
      show_form_validation_error__all() {
        let array = this.form_validation_errors.map(o => o.name)
        //console.log('show_form_validation_error__all - array', array)
        this.show_form_validation_error = [...array]
      },
      show_form_validation_error__add(name) {
        let show = this.show_form_validation_error
        if ( !show.find(i => i === name) ) {
          show.push(name)
        }
      },
      process_input(value, name) {
        console.log('process_input - value, name:', value, name)
        this.show_form_validation_error__add(name)
        this.form_data[name] = value
      },
      submit_form(event) {
        this.validate_form()
        this.show_form_validation_error__all()

        //console.log('submit_form - form_data:', this.form_data)

        // Set running status
        this.action_running = true

        const data = this.form_data

        // Create user
        Meteor.callPromise('method__user_create', data)
          .then(result => {
            //console.log('method__user_create - token:', result)

            // Save user token
            this.$store.commit('set_user_token', result)

            return result
          })
          .catch(error => {
            //console.log('method__user_create - error:', error)

            // Set error message
            let message = object_value(error, 'error', 'Error')
            switch (message) {
              case 'missed-parameters':
                message = 'Parameters missed'
                break
              case 'registered-email-or-username':
                message = `Email "${data.email}" or&nbsp;username "${data.username}" is already registered`
                break
            }
            this.action_error = message

            return error
          })
          .then(result => {
            // Finish
            this.action_running = false
          })

      }
    }
  }
</script>
<template>
  <form class="b-form"
        @input="validate_form"
        @submit.prevent="submit_form"
        novalidate>

    <template v-if="form_title">
      <h2>{{form_title}}</h2>
      <hr>
    </template>

    <template v-if="show_edit_button">
      <button class="btn btn-primary btn-sm"
              type="button"
              @click="toggle_edit()">Edit
      </button>

      <hr>
    </template>

    <fieldset :disabled="form_is_disabled">
      <template v-if="form_name === 'register'">
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
               :show="!!action_error">
        <strong>Not submitted</strong><br>
        <small v-html="action_error"></small>
      </b-alert>

      <footer v-if="!form_is_disabled"
              class="b-form-footer d-flex align-items-baseline">

        <button class="col-auto btn btn-primary"
                :disabled="!allow_submit">Submit</button>

        <div class="col"
             v-if="!allow_submit">Fill the form, please.</div>

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
    props: [
      'schema',
      'form_name',
      'form_title',
      'form_loaded_data',
      'form_toggle_edit'
    ],
    data() {
      return {
        route_name: null,
        form_data: {},
        form_is_valid: true,
        form_validation_errors: [],
        show_form_validation_error: [],
        action_running: false,
        action_error: false,
        form_disabled: false
      }
    },
    created() {
      if (this.form_toggle_edit) {
        this.form_disabled = true
      }

      // Set initial values
      Object.entries( this.schema_items ).forEach(([key, value]) => {
        let form_value = object_value(value, 'form.value', null)

        if ( form_value !== null ) {
          this.form_data[key] = form_value
        }
      })

      // Set loaded values
      let form_loaded_data = this.form_loaded_data
      if (!!form_loaded_data) {
        console.log('form_loaded_data:', form_loaded_data)

        Object.entries( form_loaded_data ).forEach(([key, value]) => {
          this.form_data[key] = value
        })
      }
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
      form_is_disabled() {
        return this.action_running || this.form_disabled
      },
      show_edit_button() {
        return this.form_is_disabled && this.form_toggle_edit
      }
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

        // Set validation statuses
        this.form_is_valid = validationContext.isValid()
        this.form_validation_errors = validationContext.validationErrors()
        console.log('form_validation_errors:', validationContext.validationErrors())

        // Reset form submit action error
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

        // Register
        if (this.form_name === 'register') {
          Meteor.callAsync('method__user_create', data)
            .then(result => {
              //console.log('method__user_create - token:', result)

              // Save user token
              this.$store.commit('set_user_token', result)

              // Show notification
              this.$notify({
                group: 'notifications',
                title: 'Success',
                text: 'You have been registered'
              })

              // Proceed to profile
              this.$router.push({name: 'profile'}, () => window.scrollTo(0,0))

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
              
              // Show notification
              this.$notify({
                group: 'notifications',
                title: 'Not submitted',
                text: message
              })

              return error
            })
            .then(result => {
              // Finish
              this.action_running = false
            })
        }

        // Sign in
        if (this.form_name === 'sign_in') {
          Meteor.callAsync('method__user_sign_in', data)
            .then(result => {
              // Save user token
              this.$store.commit('set_user_token', result)

              // Proceed to profile
              this.$router.push({name: 'profile'})

              return result
            })
            .catch(error => {
              console.log('method__user_sign_in - error:', error)

              return error
            })
            .then(result => {
              // Finish
              this.action_running = false
            })
        }

        // Update user profile
        if (this.form_name === 'user') {
          Meteor.callAsync('method__user_update', data, this.$store.state.user_token)
            .then(result => {
              console.log('method__user_update - result:' , result)

              // Save updated value in store
              this.$store.commit('set_user', result)

              // Show notification
              this.$notify({
                group: 'notifications',
                title: 'Success',
                text: 'Your profile has been updated'
              })

              // Finish form editing
              this.form_disabled = true

              return result
            })
            .catch(error => {
              console.log('method__user_update - error:', error)

              // Set error message
              let message = object_value(error, 'error', 'Error')
              this.action_error = message

              // Show notification
              this.$notify({
                group: 'notifications',
                title: 'Not updated',
                text: message
              })

              return error
            })
            .then(result => {
              // Finish
              this.action_running = false
            })
        }

        // Update password
        if (this.form_name === 'update_password') {
          Meteor.callAsync('method__user_password_update', data, this.$store.state.user_token)
            .then(result => {
              console.log('method__user_password_update - result:' , result)

              // Show notification
              this.$notify({
                group: 'notifications',
                title: 'Success',
                text: 'Your password has been updated'
              })

              // Finish form editing
              this.form_disabled = true

              return result
            })
            .catch(error => {
              console.log('method__user_password_update - error:', error)

              // Set error message
              let message = object_value(error, 'error', 'Error')
              this.action_error = message

              // Show notification
              this.$notify({
                group: 'notifications',
                title: 'Not updated',
                text: message
              })

              return error
            })
            .then(result => {
              // Finish
              this.action_running = false
            })
        }

        // Reset password
        if (this.form_name === 'reset_password') {
          Meteor.callAsync('method__user_password_reset', data)
            .then(result => {
              console.log('method__user_password_reset - result:' , result)

              // Show notification
              this.$notify({
                group: 'notifications',
                title: 'Success',
                text: 'Your password has been reset'
              })

              // Finish form editing
              this.form_disabled = true

              return result
            })
            .catch(error => {
              console.log('method__user_password_reset - error:', error)

              // Set error message
              let message = object_value(error, 'error', 'Error')
              this.action_error = message

              // Show notification
              this.$notify({
                group: 'notifications',
                title: 'Not reset',
                text: message
              })

              return error
            })
            .then(result => {
              // Finish
              this.action_running = false
            })
        }

      },
      toggle_edit() {
        this.form_disabled = !this.form_disabled
      }
    }
  }
</script>
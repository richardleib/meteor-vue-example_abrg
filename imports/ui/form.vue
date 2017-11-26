<template>
  <div class="row justify-content-md-center">
    <form class="home col-12 col-md-6 col-md-4"
          @input="validate_form"
          @submit.prevent="submit_form"
          novalidate>

      <form__item v-for="(item, index) of schema_items_array"
                  :key="index"
                  :item="item"
                  :validation_error="validation_error(item.name)"
                  :value="form_data[item.name]"
                  @input="value => process_input(value, item.name)"/>

      <footer class="b-form-footer d-flex align-items-baseline">
        <button class="btn btn-primary"
                :disabled="!allow_submit">submit</button>

        <div class="col-auto"
             v-if="!allow_submit">Fill the form, please.</div>
      </footer>

    </form>
  </div>
</template>

<script>
  import { Meteor } from 'meteor/meteor'
  import object_value from '/imports/api/helpers/object_value'
  import form__item from './form__item.vue'

  export default {
    props: ['schema'],
    data() {
      return {
        form_data: {},
        form_is_valid: true,
        form_validation_errors: [],
        show_form_validation_error: []
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
      this.validate_form()
    },
    components: {
      form__item
    },
    watch: {
      form_data(value, old_value) {
        console.log('watch form_data - value, old_value:', value, old_value)
      }
    },
    computed: {
      schema_items() {
        return this.$store.getters.schema_items( this.schema )
      },
      schema_items_array() {
        return this.$store.getters.schema_items_array( this.schema )
      },
      allow_submit() {
        return this.form_is_valid
      },
    },
    methods: {
      object_value() {
        return object_value(...arguments)
      },
      validate_form() {
        let validationContext = this.schema.newContext()
        //console.log('this.form_data:', this.form_data)

        let data = this.form_data
        //let keys = Object.entries( data ).map(o => o.name)
        //console.log('data, keys:', data, keys)
        //let is_valid = validationContext.validate(data, { keys })

        validationContext.validate(data)

        this.form_is_valid = validationContext.isValid()

        let validation_errors = validationContext.validationErrors()
        console.log('validate - validation_errors:', validation_errors)
        this.form_validation_errors = validation_errors
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
        console.log('submit_form - form_data:', this.form_data)
      }
    }
  }
</script>
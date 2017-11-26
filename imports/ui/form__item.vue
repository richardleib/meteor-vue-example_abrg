<template>
  <div :class="!is_checkbox_or_radio ? 'form-group' : 'form-check'">
    <component :is="is_checkbox_or_radio ? 'label' : 'div'"
               :class="is_checkbox_or_radio ? 'form-check-label' : ''">

      <label v-if="!is_checkbox_or_radio"
             :for="item.name">
        {{item.label}} <small v-if="is_required">(required)</small>
      </label>

      <component :is="object_value(item, 'form.element', 'input')"
                 :type="object_value(item, 'form.type', 'text')"
                 :class="[!is_checkbox_or_radio ? 'form-control' : 'form-check-input', !is_valid ? 'is-invalid' : '']"
                 :id="item.name"
                 :name="item.name"
                 :aria-describedby="item.name"
                 :readonly="object_value(item, 'form.readonly')"
                 :disabled="object_value(item, 'form.disabled')"
                 :required="is_required"
                 :value="value"
                 :checked="is_checked"
                 @input="run_on_input"
                 @click="run_on_click">

        <template v-if="object_value(item, 'form.element') === 'select'">
          <option value=''
                  selected>Select...
          </option>
          <option v-for="(option, index) of object_value(item, 'form.options')"
                  :key="index"
                  :value="option.value || ''"
                  :disabled="object_value(option, 'disabled')">
            {{option.label}}
          </option>
        </template>

      </component>

      <!--<small class="form-text text-muted">We'll never share your email with anyone else.</small>-->
      <div v-if="!is_valid && validation_error_message"
           class="invalid-feedback">{{validation_error_message}}</div>

      <template v-if="is_checkbox_or_radio">
        {{item.label}}
      </template>

    </component>
  </div>
</template>

<script>
  import object_value from '/imports/api/helpers/object_value'

  export default {
    props: ['value', 'item', 'validation_error'],
    computed: {
      is_required() {
        return !object_value(this, 'item.optional')
      },
      is_valid() {
        return typeof this.validation_error === "undefined"
      },
      validation_error_message() {
        let validation_error = this.validation_error
        console.log('validation_error:', validation_error)

        let message

        switch (validation_error.type) {
          case 'required':
            message = "Required field"
            break
          default:
            message = object_value(this, 'item.form.validation_message', 'Field is not valid')
            break
        }

        return message
      },
      is_checkbox_or_radio() {
        let type = object_value(this, 'item.form.type')
        return type === 'checkbox' || type === 'radio'
      },
      is_checked() {
        if (!this.is_checkbox_or_radio) {
          return false
        }

        return parseInt(this.value) === 1
      }
    },
    methods: {
      object_value() {
        return object_value(...arguments)
      },
      run_on_input(event) {
        this.$emit('input', event.target.value, this.item.name)
      },
      run_on_click(event) {
        let element = event.target
        let value = element.value

        if ( element.type === "checkbox"
          || element.type === "radio" ) {

          value = element.checked ? 1 : 0
          this.$emit('input', value, this.item.name)
        }
      }
    }
  }
</script>

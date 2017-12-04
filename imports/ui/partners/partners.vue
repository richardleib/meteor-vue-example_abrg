<template>
  <b-container>
    <b-row class="justify-content-md-center">
      <b-col md="6">
        <table-component tableClass="table"
                         :data="fetchData"
                         sort-by="username"
                         sort-order="asc"
                         filterInputClass="form-control form-control-sm w-50">
          <table-column show="username" label="Username"></table-column>
          <table-column show="email" label="Email"></table-column>
          <table-column show="online" label="Online" :formatter="true_false"></table-column>
        </table-component>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { Meteor } from 'meteor/meteor'
  import { TableComponent, TableColumn } from 'vue-table-component'
  import throttle from 'throttle-debounce/throttle'
  import object_value from '/imports/api/helpers/object_value'

  export default {
    components: {
      'table-component': TableComponent,
      'table-column': TableColumn
    },
    methods: {
      true_false(value, rowProperties) {
        return value ? 'Online' : 'Offline'
      },
      fetchData: throttle(1000, async function({ page = 1, filter, sort }) {
        console.log('fetchData:', ...arguments)

        const user_token = this.$store.state.user_token

        let response = {}

        // Direct Meteor method call, no Vuex store and methods here
        await Meteor.callAsync('method__partners_load', user_token)
          .then(result => {
            console.log('method__partners_load - result:', result)

            response = {
              data: result
            }

            return response
          })
          .catch(error => {
            console.error('method__partners_load - error:', error)

            // Set error message
            let message = object_value(error, 'error', 'Error')
            this.action_error = message

            // Show notification
            this.$notify({
              group: 'notifications',
              title: 'Not fetched',
              text: message
            })

            return error
          })

        console.log('fetchData - response:', response)
        return response
      })
    }
  }
</script>

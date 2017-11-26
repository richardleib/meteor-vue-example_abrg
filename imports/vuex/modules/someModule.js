import { Meteor } from 'meteor/meteor'

const someModule = {
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters: {
    schema_items: state => schema => {
      return schema._schema
    },
    schema_items_array: (state, getters) => schema => {
      // Get schema items
      let schema_items = getters.schema_items(schema)

      // Reformat object to array, add schema item name
      schema_items = Object.entries(schema_items).map(([key, value]) => {
        return {
          name: key,
          ...value
        }
      })

      return schema_items
    },
  }
}

export default someModule

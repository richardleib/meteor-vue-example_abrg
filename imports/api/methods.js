import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import { schema__user_create } from '/imports/api/schemas'
import object_value from '/imports/api/helpers/object_value'

Meteor.methods({
  async method__user_create(data) {
    schema__user_create.validate(data)

    let url = object_value(Meteor, 'settings.private.API.user_create')
    if (!url) {
      throw new Meteor.Error('no-request-url')
    }

    try {
      const result = HTTP.post(url, { data })
      console.log('method__user_create - result:', result)

      let token = object_value(result, 'data.token')

      if (!token) {
        return false
      }

      return token

    } catch (error) {

      // Got a network error, timeout, or HTTP error in the 400 or 500 range
      console.log('method__user_create - error:', error)

      if ( error.response.statusCode === 400 ) {
        throw new Meteor.Error('missed-parameters')
      }

      if ( error.response.statusCode === 409 ) {
        throw new Meteor.Error('registered-email-or-username')
      }

      return error
    }
  }
})
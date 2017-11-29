import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import { schema__user_create, schema__user_login } from '/imports/api/user/schemas'
import object_value from '/imports/api/helpers/object_value'
import { encrypt } from '/imports/api/helpers/encrypt'

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

      // Send email
      Meteor.callAsync('method__email_send', {
        to: data.firstName + ' ' + data.secondName + ' <' + data.email + '>',
        subject: 'Registration confirmed',
        html: `
          <p>Dear ${data.firstName},<br><br> you registered as <strong>${data.username}</strong>.</p>
          <p><a href="${Meteor.absoluteUrl()}">[Demo application]</a></p>
          `
      }).catch(error => console.log('method__user_create - method__email_send - error:', error))

      return encrypt(token)

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
  },
  async method__user_sign_in(data) {
    schema__user_login.validate(data)

    let url = object_value(Meteor, 'settings.private.API.user_sign_in')
    if (!url) {
      throw new Meteor.Error('no-request-url')
    }

    try {
      const result = HTTP.get(url, { params: data })
      console.log('method__user_sign_in - result:', result)

      let token = object_value(result, 'data.token')

      if (!token) {
        return false
      }

      return encrypt(token)

    } catch (error) {

      // Got a network error, timeout, or HTTP error in the 400 or 500 range
      console.log('method__user_sign_in - error:', error)

      if ( error.response.statusCode === 400 ) {
        throw new Meteor.Error('wrong-parameters')
      }

      if ( error.response.statusCode === 401 ) {
        throw new Meteor.Error('authorisation-refused')
      }

      if ( error.response.statusCode === 404 ) {
        throw new Meteor.Error('user-not-found')
      }

      if ( error.response.statusCode === 500 ) {
        throw new Meteor.Error('server-error')
      }

      return error
    }
  }
})
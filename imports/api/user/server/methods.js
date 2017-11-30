import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import { schema__user_create, schema__user_login, schema__user_update } from '/imports/api/user/schemas'
import object_value from '/imports/api/helpers/object_value'
import { encrypt, decrypt } from '/imports/api/helpers/encrypt'
import SimpleSchema from "simpl-schema"

function format_loaded_user_data(data) {
  if (!data) {
    return false
  }

  // Flatten object keys objects
  let keys = ['links', 'settings']
  for (let key of keys) {
    if ( data[key] === Object(data[key]) ) {
      data = {...data, ...data[key]}

      delete data[key]
    }
  }

  // Get sponsor username
  data.get__sponsor_username = object_value(data, 'sponsor.username') || object_value(data, 'sponsor._id')

  // Include only items from the schema
  let filter_array = Object.keys(schema__user_update._schema)
  let filtered_data = {}
  Object.entries(data)
    .forEach(([key, value]) => {
      if (filter_array.includes(key)
        && value !== "") {
        filtered_data[key] = value
      }
    })

  console.log('method__user_load - filtered_data:', filtered_data)
  return filtered_data
}

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
          <p>Dear ${data.firstName}!<br> You registered as <strong>${data.username}</strong>.</p>
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
  },
  async method__user_load(user_token) {
    new SimpleSchema({
      user_token: {type: String}
    }).validate({user_token})

    let url = object_value(Meteor, 'settings.private.API.user_load')
    if (!url) {
      throw new Meteor.Error('no-request-url')
    }

    const token = decrypt(user_token)
    console.log('method__user_load - token:', token)

    try {
      const result = HTTP.get(url, { params: {token} })
      // console.log('method__user_load - result:', result)

      return format_loaded_user_data( result.data )

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
  },
  async method__user_update(data, user_token) {
    schema__user_update.validate(data)

    new SimpleSchema({
      user_token: {type: String}
    }).validate({user_token})

    let url = object_value(Meteor, 'settings.private.API.user_edit')
    if (!url) {
      throw new Meteor.Error('no-request-url')
    }

    const token = decrypt(user_token)

    // Process sponsor username
    let sponsor_username = object_value(data, 'get__sponsor_username')
    if (sponsor_username) {
      data.sponsor = sponsor_username
      delete data.get__sponsor_username
    }

    data = {token, ...data}
    console.log('method__user_load - data:', { data })

    try {
      const result = HTTP.put(url, { data })
      // console.log('method__user_update - result:', result)

      return format_loaded_user_data( result.data )

    } catch (error) {

      // Got a network error, timeout, or HTTP error in the 400 or 500 range
      console.log('method__user_sign_in - error:', error)

      if ( error.response.statusCode === 400 ) {
        throw new Meteor.Error('wrong-parameters')
      }

      if ( error.response.statusCode === 403 ) {
        throw new Meteor.Error('authorisation-refused')
      }

      if ( error.response.statusCode === 404 ) {
        throw new Meteor.Error('sponsor-not-found')
      }

      if ( error.response.statusCode === 409 ) {
        throw new Meteor.Error('conflict')
      }

      if ( error.response.statusCode === 500 ) {
        throw new Meteor.Error('server-error')
      }

      return error
    }
  }
})
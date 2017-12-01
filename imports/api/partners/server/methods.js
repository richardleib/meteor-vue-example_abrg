import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import { schema__user_partners } from '/imports/api/partners/schemas'
import object_value from '/imports/api/helpers/object_value'
import { encrypt, decrypt } from '/imports/api/helpers/encrypt'
import SimpleSchema from "simpl-schema"

Meteor.methods({
  /**
   * Load user partners
   * @param user_token Stored on client encrypted token
   * @returns {Promise<*>}
   */
  async method__partners_load(user_token) {
    new SimpleSchema({
      user_token: {type: String}
    }).validate({user_token})

    let url = object_value(Meteor, 'settings.private.API.user_partners_load')
    if (!url) {
      throw new Meteor.Error('no-request-url')
    }

    const token = decrypt(user_token)
    console.log('method__partners_load - token:', token)

    try {
      const result = HTTP.get(url, { params: {token} })
      console.log('method__partners_load - result:', result)

      return result.data

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
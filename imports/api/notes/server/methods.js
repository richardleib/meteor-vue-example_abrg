import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import {
  schema__notes_load,
  schema__note_create,
  schema__note_update,
  schema__note_delete
} from '/imports/api/notes/schemas'
import object_value from '/imports/api/helpers/object_value'
import { encrypt, decrypt } from '/imports/api/helpers/encrypt'
import SimpleSchema from 'simpl-schema'
import faker from 'faker'

Meteor.methods({
  /**
   * Load user notes
   * @param [search_query] Filter request
   * @param user_token Stored on client encrypted token
   * @returns {Promise<*>}
   */
  async method__notes_load({search_query = {}, user_token}) {
    schema__notes_load.validate(search_query)

    new SimpleSchema({
      user_token: {type: String}
    }).validate({user_token})

    let url = object_value(Meteor, 'settings.private.API.user_note')
    if (!url) {
      throw new Meteor.Error('no-request-url')
    }

    const token = decrypt(user_token)
    console.log('method__notes_load - token:', token)

    try {
      const result = HTTP.get(url, { params: {token, ...search_query} })
      console.log('method__notes_load - result:', result)

      return result.data

    } catch (error) {

      // Got a network error, timeout, or HTTP error in the 400 or 500 range
      console.log('method__notes_load - error:', error)

      if ( error.response.statusCode === 400 ) {
        throw new Meteor.Error('wrong-parameters')
      }

      if ( error.response.statusCode === 401 ) {
        throw new Meteor.Error('authorisation-refused')
      }

      if ( error.response.statusCode === 500 ) {
        throw new Meteor.Error('server-error')
      }

      return error
    }
  },
  /**
   * Create a note
   * @param data
   * @param user_token Stored on client encrypted token
   * @returns {Promise<*>}
   */
  async method__note_create(data, user_token) {
    schema__note_create.validate(data)

    new SimpleSchema({
      user_token: {type: String}
    }).validate({user_token})

    let url = object_value(Meteor, 'settings.private.API.user_note')
    if (!url) {
      throw new Meteor.Error('no-request-url')
    }

    const token = decrypt(user_token)

    data = {token, ...data}
    console.log('method__note_create - data:', { data })

    try {
      const result = HTTP.post(url, { data })
      console.log('method__note_create - result:', result)

      return result.data

    } catch (error) {

      // Got a network error, timeout, or HTTP error in the 400 or 500 range
      console.log('method__note_create - error:', error)

      if ( error.response.statusCode === 400 ) {
        throw new Meteor.Error('wrong-parameters')
      }

      if ( error.response.statusCode === 403 ) {
        throw new Meteor.Error('authorisation-refused')
      }

      if ( error.response.statusCode === 500 ) {
        throw new Meteor.Error('server-error')
      }

      return error
    }
  },
  /**
   * Generate notes
   * @param amount
   * @param user_token Stored on client encrypted token
   * @returns {Promise<*>}
   */
  async method__notes_generate(amount = 10, user_token) {
    new SimpleSchema({
      amount: {type: Number},
      user_token: {type: String}
    }).validate({amount, user_token})

    for (let i of Array(amount)) {
      let data = {
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraphs()
      }

      Meteor.callAsync('method__note_create', data, user_token)
    }

    return true
  },
  /**
   * Update a note
   * @param data
   * @param user_token Stored on client encrypted token
   * @returns {Promise<*>}
   */
  async method__note_update(data, user_token) {
    schema__note_update.validate(data)

    new SimpleSchema({
      user_token: {type: String}
    }).validate({user_token})

    let url = object_value(Meteor, 'settings.private.API.user_note')
    if (!url) {
      throw new Meteor.Error('no-request-url')
    }

    const token = decrypt(user_token)

    data = {token, ...data}
    console.log('method__note_update - data:', { data })

    try {
      const result = HTTP.put(url, { data })
      console.log('method__note_update - result:', result)

      return result.data

    } catch (error) {

      // Got a network error, timeout, or HTTP error in the 400 or 500 range
      console.log('method__note_update - error:', error)

      if ( error.response.statusCode === 400 ) {
        throw new Meteor.Error('wrong-parameters')
      }

      if ( error.response.statusCode === 401 ) {
        throw new Meteor.Error('authorisation-refused')
      }

      if ( error.response.statusCode === 500 ) {
        throw new Meteor.Error('server-error')
      }

      return error
    }
  },
  /**
   * Delete a note
   * @param data
   * @param user_token Stored on client encrypted token
   * @returns {Promise<*>}
   */
  async method__note_delete(data, user_token) {
    schema__note_delete.validate(data)

    new SimpleSchema({
      user_token: {type: String}
    }).validate({user_token})

    let url = object_value(Meteor, 'settings.private.API.user_note')
    if (!url) {
      throw new Meteor.Error('no-request-url')
    }

    const token = decrypt(user_token)

    data = {token, ...data}
    console.log('method__note_delete - data:', { data })

    try {
      const result = HTTP.del(url, { data })
      console.log('method__note_delete - result:', result)

      return result.data

    } catch (error) {

      // Got a network error, timeout, or HTTP error in the 400 or 500 range
      console.log('method__note_delete - error:', error)

      if ( error.response.statusCode === 400 ) {
        throw new Meteor.Error('wrong-parameters')
      }

      if ( error.response.statusCode === 403 ) {
        throw new Meteor.Error('authorisation-refused')
      }

      if ( error.response.statusCode === 500 ) {
        throw new Meteor.Error('server-error')
      }

      return error
    }
  },
})
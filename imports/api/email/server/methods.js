import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { Email } from 'meteor/email'
import object_value from '/imports/api/helpers/object_value'

Meteor.methods({
  method__email_send({to, from = object_value(Meteor, 'settings.private.email.from'), subject, html}) {
    new SimpleSchema({
      to: {type: String}, // regEx: SimpleSchema.RegEx.Email
      from: {type: String}, // regEx: SimpleSchema.RegEx.Email
      subject: {type: String},
      html: {type: String}
    }).validate({to, from, subject, html})

    Email.send({to, from, subject, html})
  }
})
import object_value from '/imports/api/helpers/object_value'

Meteor.startup( function(){
  // Set mail URL
  process.env.MAIL_URL = object_value(Meteor, 'settings.private.smtp')
  process.env.MAIL_FROM = object_value(Meteor, 'settings.private.email.from')
})
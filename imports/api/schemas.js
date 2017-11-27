import SimpleSchema from 'simpl-schema'
import { Tracker } from 'meteor/tracker'
import { check } from 'meteor/check'
import * as options from '/imports/api/schema_defualts'

SimpleSchema.extendOptions(['form'])

let sponsor = {
  ...options.for_name,
  form: {
    readonly: true,
    value: 'testareg1'
  }
}

let finPassword = {
  ...options.for_password,
  label: 'Financial password'
}

export const schema__user_create = new SimpleSchema({
  sponsor,
  username: options.for_name,
  password: options.for_password,
  email: options.for_email,
  firstName: options.for_name,
  secondName: options.for_name,
  finPassword,
  country: options.for_country,
  phone: {
    type: String,
    regEx: SimpleSchema.RegEx.Phone
  },
  skype: {
    ...options.for_string,
    optional: true
  }
}, {
  check,
  tracker: Tracker
})

export const schema__user_update = new SimpleSchema({
  sponsor,
  username: options.for_name,
  email: options.for_email,
  firstName: options.for_name,
  secondName: options.for_name,
  password: {
    type: String
  },
  birthday: Date,
  phoneNumber: options.for_phone,
  phoneNumber2: options.for_phone,
  skype: options.for_string,
  country: options.for_country,
  state: options.for_string,
  city: options.for_string,
  address: {
    ...options.for_string,
    max: 256
  },
  zipCode: options.for_string,
  site: options.for_string,
  odnoklassniki: options.for_string,
  vk: options.for_string,
  fb: options.for_string,
  youtube: options.for_string,
  autoExtensionBS: options.for_numeric_boolean,
  showMobile: options.for_numeric_boolean,
  showEmail: options.for_numeric_boolean,
  showName: options.for_numeric_boolean,
  deliveryEMail: options.for_numeric_boolean,
  deliverySMS: options.for_numeric_boolean
}, {
  check,
  tracker: Tracker,
  requiredByDefault: false
})

export const schema__user_resetPassword = new SimpleSchema({
  token: String,
  oldPassword: options.for_password,
  newPassword: options.for_password,
  type: options.for_numeric_boolean
}, {
  check,
  tracker: Tracker
})
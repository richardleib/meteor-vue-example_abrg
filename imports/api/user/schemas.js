import SimpleSchema from 'simpl-schema'
import { Tracker } from 'meteor/tracker'
import { check } from 'meteor/check'
import * as options from '/imports/api/helpers/schema_defaults'

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

let password_type = {
  type: String,
  form: {
    element: 'select',
    options: [
      {
        selected: true,
        label: 'User password',
        value: '0'
      },
      {
        label: 'Financial password',
        value: '1'
      }
    ]
  }
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

export const schema__user_login = new SimpleSchema({
  username: options.for_name,
  password: options.for_password
}, {
  check,
  tracker: Tracker
})

export const schema__password_update = new SimpleSchema({
  // token: String,
  type: password_type,
  oldPassword: options.for_password,
  newPassword: options.for_password
}, {
  check,
  tracker: Tracker
})

export const schema__password_reset = new SimpleSchema({
  type: password_type,
  username: options.for_name
}, {
  check,
  tracker: Tracker
})

export const schema__user_update = new SimpleSchema({
  get__sponsor_username: {
    ...sponsor,
    label: 'Sponsor'
  },
  username: options.for_name,
  email: options.for_email,
  firstName: options.for_name,
  secondName: options.for_name,
  birthday: options.for_date,
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
  odnoklassniki: {
    ...options.for_string,
    label: 'Odnoklassniki profile address'
  },
  vk: {
    ...options.for_string,
    label: 'VK profile address'
  },
  fb: {
    ...options.for_string,
    label: 'Facebook profile address'
  },
  youtube: {
    ...options.for_string,
    label: 'Youtube profile address'
  },
  autoExtensionBS: {
    ...options.for_numeric_boolean,
    label: 'BS auto extension'
  },
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
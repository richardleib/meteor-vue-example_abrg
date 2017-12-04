import SimpleSchema from 'simpl-schema'
import { Tracker } from 'meteor/tracker'
import { check } from 'meteor/check'
import * as options from '/imports/api/helpers/schema_defaults'

SimpleSchema.extendOptions(['form'])

export const schema__user_partners = new SimpleSchema({
  idUser: options.for_string,
  limit: options.for_number,
  skip: options.for_number,
  sort: options.for_string,
  filterField: options.for_string,
  filterValue: options.for_string
}, {
  check,
  tracker: Tracker,
  requiredByDefault: false
})
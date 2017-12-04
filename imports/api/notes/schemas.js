import SimpleSchema from 'simpl-schema'
import { Tracker } from 'meteor/tracker'
import { check } from 'meteor/check'
import * as options from '/imports/api/helpers/schema_defaults'

SimpleSchema.extendOptions(['form'])

export const schema__notes_load = new SimpleSchema({
  id: options.for_string,
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

export const schema__note_create = new SimpleSchema({
  title: {
    ...options.for_string,
    optional: true
  },
  body: options.for_textarea
}, {
  check,
  tracker: Tracker
})

export const schema__note_update = new SimpleSchema({
  id: options.for_string,
  title: {
    ...options.for_string,
    optional: true
  },
  body: {
    ...options.for_textarea,
    optional: true
  }
}, {
  check,
  tracker: Tracker
})

export const schema__note_delete = new SimpleSchema({
  id: options.for_string
}, {
  check,
  tracker: Tracker
})
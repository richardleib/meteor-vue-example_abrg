import { Meteor } from 'meteor/meteor'
import object_value from '/imports/api/helpers/object_value'
import crypto from 'crypto'

let
  algorithm = 'aes-128-cbc',
  password = object_value(Meteor, 'settings.private.encryption_password', 's9f34w8cBi93gVqx'),
  iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f'

/**
 * Node.js encryption
 * @param {String} plain_text
 * @example
 * let hw = encrypt("hello world")
 * // outputs hello world
 * console.log(decrypt(hw))
 * @returns {*|Boolean} Returns value or false.
 */
export function encrypt(plain_text) {
  if (Meteor.isServer) {
    let m = crypto.createHash('md5')
    m.update(password)
    let key = m.digest()
    let cipher = crypto.createCipheriv(algorithm, key, iv)
    let encoded = cipher.update(plain_text, 'utf8', 'hex')
    encoded += cipher.final('hex')
    return encoded
  }
}

/**
 * Node.js cryption
 * @param {String} encrypted_text
 * @example
 * let hw = encrypt("hello world")
 * // outputs hello world
 * console.log(decrypt(hw))
 * @returns {*|Boolean} Returns value or false.
 */
export function decrypt(encrypted_text) {
  if (Meteor.isServer) {
    let m = crypto.createHash('md5')
    m.update(password)
    let key = m.digest()
    let decipher = crypto.createDecipheriv(algorithm, key, iv)
    let decoded = decipher.update(encrypted_text, 'hex', 'utf8')
    decoded += decipher.final('utf8')
    return decoded
  }
}
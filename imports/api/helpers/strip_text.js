import striptags from 'striptags'
import string_prune from 'underscore.string/prune'

/**
 * Strip text
 * @param text
 * @returns {*} Returns value
 */
export default function strip_text({text, limit}) {
  if (!text) {
    return;
  }

  text = striptags(text, ['p'])

  text = (text + '')
    // Remove double line breaks
    .replace(/\n{2,}/g, '\n')
    // Remove all type of double spaces
    // .replace(/(\s)+/g, ' ') //.replace(/ +/g, ' ')
    // Replace all type of new lines
    .replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2')
    // Remove codes
    .replace(/(&nbsp;)/gm,"")

  if (limit > 0) {
    return string_prune(text, limit)
  }

  return text
}

'use strict'

/**
 * RemoveDiacritics static class.
 * @class
 */
class RemoveDiacritics {

  static process (str, locale = '') {
    const chars = { /* ${chars} */ }

    /* ${conditions} */

    let result = []
    for (const c of str) {
      result.push(chars[c] || c)
    }
    return result.join('')
  }
}

module.exports = function (str, locale) {
  return RemoveDiacritics.process(str, locale);
};

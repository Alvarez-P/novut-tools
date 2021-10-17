module.exports.isArray = (mixedVar) => {
  const _getFuncName = function (fn) {
    const name = /\W*function\s+([\w$]+)\s*\(/.exec(fn)
    if (!name) {
      return '(Anonymous)'
    }
    return name[1]
  }
  const _isArray = function (mixedVar) {
    // return Object.prototype.toString.call(mixedVar) === '[object Array]';
    // The above works, but let's do the even more stringent approach:
    // (since Object.prototype.toString could be overridden)
    // Null, Not an object, no length property so couldn't be an Array (or String)
    if (
      !mixedVar ||
      typeof mixedVar !== 'object' ||
      typeof mixedVar.length !== 'number'
    ) {
      return false
    }
    const len = mixedVar.length
    mixedVar[mixedVar.length] = 'bogus'
    // The only way I can think of to get around this (or where there would be trouble)
    // would be to have an object defined
    // with a custom "length" getter which changed behavior on each call
    // (or a setter to mess up the following below) or a custom
    // setter for numeric properties, but even that would need to listen for
    // specific indexes; but there should be no false negatives
    // and such a false positive would need to rely on later JavaScript
    // innovations like __defineSetter__
    if (len !== mixedVar.length) {
      // We know it's an array since length auto-changed with the addition of a
      // numeric property at its length end, so safely get rid of our bogus element
      mixedVar.length -= 1
      return true
    }
    // Get rid of the property we added onto a non-array object; only possible
    // side-effect is if the user adds back the property later, it will iterate
    // this property in the older order placement in IE (an order which should not
    // be depended on anyways)
    delete mixedVar[mixedVar.length]
    return false
  }

  if (!mixedVar || typeof mixedVar !== 'object') {
    return false
  }

  const isArray = _isArray(mixedVar)

  if (isArray) {
    return true
  }

  const iniVal =
    (typeof require !== 'undefined'
      ? require('../info/ini_get')('locutus.objectsAsArrays')
      : undefined) || 'on'
  if (iniVal === 'on') {
    const asString = Object.prototype.toString.call(mixedVar)
    const asFunc = _getFuncName(mixedVar.constructor)

    if (asString === '[object Object]' && asFunc === 'Object') {
      // Most likely a literal and intended as assoc. array
      return true
    }
  }

  return false
}
module.exports.isBool = (mixedVar) => mixedVar === true || mixedVar === false
module.exports.isString = (mixedVar) => typeof mixedVar === 'string'
module.exports.sanitizeObject = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))

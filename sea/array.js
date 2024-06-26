let __usable_isActivated = false
const __usable_module = {}

/**
 *
 * @param __usable_environment
 * @param __usable_MODULE
 */
export default function (__usable_environment) {
  if (__usable_isActivated) return __usable_module.exports
  __usable_isActivated = true
  /* BEGIN WRAPPED GUN CODE */

  // This is Array extended to have .toString(['utf8'|'hex'|'base64'])
  /**
	 *
	 */
  function SeaArray () {}
  Object.assign(SeaArray, {
    from: Array.from
  })
  SeaArray.prototype = Object.create(Array.prototype)
  SeaArray.prototype.toString = function (enc, start, end) {
    enc = enc || 'utf8'
    start = start || 0
    const length = this.length
    if (enc === 'hex') {
      const buf = new Uint8Array(this)
      return [...Array(((end && end + 1) || length) - start).keys()]
        .map((i) => buf[i + start].toString(16).padStart(2, '0'))
        .join('')
    }
    if (enc === 'utf8') {
      return Array.from(
        {
          length: (end || length) - start
        },
        (_, i) => String.fromCharCode(this[i + start])
      ).join('')
    }
    if (enc === 'base64') {
      return btoa(this)
    }
  }
  __usable_module.exports = SeaArray
  __usable_environment.exports.sea.array = __usable_module.exports
  return __usable_module.exports
}

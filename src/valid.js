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

  // Valid values are a subset of JSON: null, binary, number (!Infinity), text,
  // or a soul relation. Arrays need special algorithms to handle concurrency,
  // so they are not supported directly. Use an extension that supports them if
  // needed but research their problems first.
  __usable_module.exports = (
    v // "deletes", nulling out keys.
  ) => v === null ||
		typeof v === 'string' ||
		typeof v === 'boolean' ||
		// we want +/- Infinity to be, but JSON does not support it, sad face.
		// can you guess what v === v checks for? ;)
		(typeof v === 'number' && v != Infinity && v != -Infinity && v === v) ||
		(Boolean(v) && typeof v['#'] === 'string' && Object.keys(v).length === 1 && v['#'])
  __usable_environment.exports.gun.valid = __usable_module.exports
  return __usable_module.exports
}

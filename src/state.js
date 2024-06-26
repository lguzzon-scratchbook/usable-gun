import shimPlugin from './shim.js'
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

  shimPlugin(__usable_environment)
  /**
	 *
	 */
  function State () {
    const t = Number(new Date())
    if (last < t) {
      return (N = 0), (last = t + State.drift)
    }
    return (last = t + (N += 1) / D + State.drift)
  }
  State.drift = 0
  const NI = -Infinity // WARNING! In the future, on machines that are D times faster than 2016AD machines, you will want to increase D by another several orders of magnitude so the processing speed never out paces the decimal resolution (increasing an integer effects the state accuracy).
  var N = 0
  var D = 999
  var last = NI
  State.is = (n, k, o) => {
    // convenience function to get the state on a key on a node and return it.
    let tmp = (k && n && n._ && n._['>']) || o
    if (!tmp) {
      return
    }
    return typeof (tmp = tmp[k]) === 'number' ? tmp : NI
  }
  State.ify = (n, k, s, v, soul) => {
    // put a key's state on a node.
    (n = n || {})._ = n._ || {} // safety check or init.
    if (soul) {
      n._['#'] = soul
    } // set a soul if specified.
    const tmp = n._['>'] || (n._['>'] = {}) // grab the states data.
    if (undefined !== k && k !== '_') {
      if (typeof s === 'number') {
        tmp[k] = s
      } // add the valid state.
      if (undefined !== v) {
        n[k] = v
      } // Note: Not its job to check for valid values!
    }
    return n
  }
  __usable_module.exports = State
  __usable_environment.exports.gun.state = __usable_module.exports
  return __usable_module.exports
}

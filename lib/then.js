import gunPlugin from '../gun.js'
let __usable_isActivated = false
/**
 *
 * @param __usable_environment
 * @param __usable_MODULE
 */
export default function (__usable_environment) {
  if (__usable_isActivated) return
  __usable_isActivated = true
  const __usable_window =
		__usable_environment.environmentHint !== 'browser'
		  ? undefined
		  : new Proxy('window' in globalThis ? window : globalThis, {
		    get (target, property) {
		      if (['window', 'globalThis', 'global'].includes(property)) {
		        return __usable_window
		      } else if (__usable_environment.library[property] !== undefined) {
		        return __usable_environment.library[property]
		      } else if ('window' in globalThis) {
		        return window[property]
		      } else {
		        return undefined
		      }
		    },
		    set (object, property, value) {
		      __usable_environment.library[property] = value
		      return true
		    }
		  })
  /* BEGIN WRAPPED GUN CODE */

  const Gun =
		typeof __usable_window !== 'undefined'
		  ? __usable_window.Gun
		  : gunPlugin(__usable_environment)

  // Returns a gun reference in a promise and then calls a callback if specified
  Gun.chain.promise = function (cb) {
    const gun = this
    var cb = cb || ((ctx) => ctx)
    return new Promise((res) => {
      gun.once(function (data, key) {
        res({
          put: data,
          get: key,
          gun: this
        }) // gun reference is returned by promise
      })
    }).then(cb) // calling callback with resolved data
  }

  // Returns a promise for the data, key of the gun call
  Gun.chain.then = function (cb) {
    const gun = this
    const p = new Promise((res) => {
      gun.once((data, key) => {
        res(data, key) // call resolve when data is returned
      })
    })
    return cb ? p.then(cb) : p
  }
}

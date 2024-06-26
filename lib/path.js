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
  Gun.chain.path = function (field, opt) {
    const back = this
    let gun = back
    let tmp
    if (typeof field === 'string') {
      tmp = field.split(opt || '.')
      if (tmp.length === 1) {
        gun = back.get(field)
        return gun
      }
      field = tmp
    }
    if (field instanceof Array) {
      if (field.length > 1) {
        gun = back
        let i = 0
        const l = field.length
        for (i; i < l; i++) {
          // gun = gun.get(field[i], (i+1 === l)? cb : null, opt);
          gun = gun.get(field[i])
        }
      } else {
        gun = back.get(field[0])
      }
      return gun
    }
    if (!field && field != 0) {
      return back
    }
    gun = back.get(`${field}`)
    return gun
  }
}

import rootPlugin from './root.js'
import shimPlugin from './shim.js'
import settingsPlugin from './settings.js'
import aeskeyPlugin from './aeskey.js'
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
  const __usable_globalThis = new Proxy(
    'window' in globalThis ? window : globalThis,
    {
      get (target, property) {
        if (['window', 'globalThis', 'global'].includes(property)) {
          return __usable_globalThis
        } else if (__usable_environment.library[property] !== undefined) {
          return __usable_environment.library[property]
        } else if ('window' in globalThis) {
          return window[property]
        } else {
          return globalThis[property]
        }
      },
      set (object, property, value) {
        __usable_environment.library[property] = value
        return true
      }
    }
  )
  /* BEGIN WRAPPED GUN CODE */

  const SEA = rootPlugin(__usable_environment)
  const shim = shimPlugin(__usable_environment)
  settingsPlugin(__usable_environment)
  const aeskey = aeskeyPlugin(__usable_environment)
  SEA.encrypt =
		SEA.encrypt ||
		(async (data, pair, cb, opt) => {
		  try {
		    opt = opt || {}
		    let key = (pair || opt).epriv || pair
		    if (undefined === data) {
		      throw '`undefined` not allowed.'
		    }
		    if (!key) {
		      if (!SEA.I) {
		        throw 'No encryption key.'
		      }
		      pair = await SEA.I(null, {
		        what: data,
		        how: 'encrypt',
		        why: opt.why
		      })
		      key = pair.epriv || pair
		    }
		    const msg = typeof data === 'string' ? data : await shim.stringify(data)
		    const rand = {
		      s: shim.random(9),
		      iv: shim.random(15)
		    } // consider making this 9 and 15 or 18 or 12 to reduce == padding.
		    const ct = await aeskey(key, rand.s, opt).then((aes) => shim/* shim.ossl || */ .subtle
		      .encrypt(
		        {
		          // Keeping the AES key scope as private as possible...
		          name: opt.name || 'AES-GCM',
		          iv: new Uint8Array(rand.iv)
		        },
		        aes,
		        new shim.TextEncoder().encode(msg)
		      ))
		    let r = {
		      ct: shim.Buffer.from(ct, 'binary').toString(opt.encode || 'base64'),
		      iv: rand.iv.toString(opt.encode || 'base64'),
		      s: rand.s.toString(opt.encode || 'base64')
		    }
		    if (!opt.raw) {
		      r = `SEA${await shim.stringify(r)}`
		    }
		    if (cb) {
		      try {
		        cb(r)
		      } catch (e) {
		        __usable_globalThis.debug.log(e)
		      }
		    }
		    return r
		  } catch (e) {
		    __usable_globalThis.debug.log(e)
		    SEA.err = e
		    if (SEA.throw) {
		      throw e
		    }
		    if (cb) {
		      cb()
		    }
		  }
		})
  __usable_module.exports = SEA.encrypt
  __usable_environment.exports.sea.encrypt = __usable_module.exports
  return __usable_module.exports
}

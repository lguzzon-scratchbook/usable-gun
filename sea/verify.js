import rootPlugin from './root.js'
import shimPlugin from './shim.js'
import settingsPlugin from './settings.js'
import sha256Plugin from './sha256.js'
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
  const S = settingsPlugin(__usable_environment)
  const sha = sha256Plugin(__usable_environment)
  SEA.verify =
		SEA.verify ||
		(async (data, pair, cb, opt) => {
		  try {
		    const json = await S.parse(data)
		    if (pair === false) {
		      // don't verify!
		      const raw = await S.parse(json.m)
		      if (cb) {
		        try {
		          cb(raw)
		        } catch (e) {
		          __usable_globalThis.debug.log(e)
		        }
		      }
		      return raw
		    }
		    opt = opt || {}
		    // SEA.I // verify is free! Requires no user permission.
		    const pub = pair.pub || pair
		    const key = SEA.opt.slow_leak
		      ? await SEA.opt.slow_leak(pub)
		      : await (shim.ossl || shim.subtle).importKey(
		        'jwk',
		        S.jwk(pub),
		        {
		          name: 'ECDSA',
		          namedCurve: 'P-256'
		        },
		        false,
		        ['verify']
		      )
		    const hash = await sha(json.m)
		    let buf
		    let sig
		    let check
		    try {
		      buf = shim.Buffer.from(json.s, opt.encode || 'base64') // NEW DEFAULT!
		      sig = new Uint8Array(buf)
		      check = await (shim.ossl || shim.subtle).verify(
		        {
		          name: 'ECDSA',
		          hash: {
		            name: 'SHA-256'
		          }
		        },
		        key,
		        sig,
		        new Uint8Array(hash)
		      )
		      if (!check) {
		        throw 'Signature did not match.'
		      }
		    } catch (e) {
		      if (SEA.opt.fallback) {
		        return await SEA.opt.fall_verify(data, pair, cb, opt)
		      }
		    }
		    const r = check ? await S.parse(json.m) : undefined
		    if (cb) {
		      try {
		        cb(r)
		      } catch (e) {
		        __usable_globalThis.debug.log(e)
		      }
		    }
		    return r
		  } catch (e) {
		    __usable_globalThis.debug.log(e) // mismatched owner FOR MARTTI
		    SEA.err = e
		    if (SEA.throw) {
		      throw e
		    }
		    if (cb) {
		      cb()
		    }
		  }
		})
  __usable_module.exports = SEA.verify
  // legacy & ossl memory leak mitigation:

  const knownKeys = {}
  SEA.opt.slow_leak = (pair) => {
    if (knownKeys[pair]) return knownKeys[pair]
    const jwk = S.jwk(pair)
    knownKeys[pair] = (shim.ossl || shim.subtle).importKey(
      'jwk',
      jwk,
      {
        name: 'ECDSA',
        namedCurve: 'P-256'
      },
      false,
      ['verify']
    )
    return knownKeys[pair]
  }
  const O = SEA.opt
  SEA.opt.fall_verify = async (data, pair, cb, opt, f) => {
    if (f === SEA.opt.fallback) {
      throw 'Signature did not match'
    }
    f = f || 1
    const tmp = data || ''
    data = SEA.opt.unpack(data) || data
    const json = await S.parse(data)
    const pub = pair.pub || pair
    const key = await SEA.opt.slow_leak(pub)
    const hash =
			f <= SEA.opt.fallback
			  ? shim.Buffer.from(
			    await shim.subtle.digest(
			      {
			        name: 'SHA-256'
			      },
			      new shim.TextEncoder().encode(await S.parse(json.m))
			    )
			  )
			  : await sha(json.m) // this line is old bad buggy code but necessary for old compatibility.
    let buf
    let sig
    let check
    try {
      buf = shim.Buffer.from(json.s, opt.encode || 'base64') // NEW DEFAULT!
      sig = new Uint8Array(buf)
      check = await (shim.ossl || shim.subtle).verify(
        {
          name: 'ECDSA',
          hash: {
            name: 'SHA-256'
          }
        },
        key,
        sig,
        new Uint8Array(hash)
      )
      if (!check) {
        throw 'Signature did not match.'
      }
    } catch (e) {
      try {
        buf = shim.Buffer.from(json.s, 'utf8') // AUTO BACKWARD OLD UTF8 DATA!
        sig = new Uint8Array(buf)
        check = await (shim.ossl || shim.subtle).verify(
          {
            name: 'ECDSA',
            hash: {
              name: 'SHA-256'
            }
          },
          key,
          sig,
          new Uint8Array(hash)
        )
      } catch (e) {
        if (!check) {
          throw 'Signature did not match.'
        }
      }
    }
    const r = check ? await S.parse(json.m) : undefined
    O.fall_soul = tmp['#']
    O.fall_key = tmp['.']
    O.fall_val = data
    O.fall_state = tmp['>']
    if (cb) {
      try {
        cb(r)
      } catch (e) {
        __usable_globalThis.debug.log(e)
      }
    }
    return r
  }
  SEA.opt.fallback = 2
  __usable_environment.exports.sea.verify = __usable_module.exports
  return __usable_module.exports
}

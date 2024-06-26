import indexPlugin from './index.js'
let __usable_isActivated = false
/**
 *
 * @param __usable_environment
 * @param __usable_MODULE
 */
export default function (__usable_environment) {
  if (__usable_isActivated) return
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

  const Gun = indexPlugin(__usable_environment)

  const next = Gun.chain.get.next
  Gun.chain.get.next = (gun, lex) => {
    let tmp
    if (!__usable_globalThis.objectPlain(lex)) {
      return (next || noop)(gun, lex)
    }
    if ((tmp = ((tmp = lex['#']) || '')['='] || tmp)) {
      return gun.get(tmp)
    }
    (tmp = gun.chain()._).lex = lex // LEX!
    gun.on('in', function (eve) {
      if (
        __usable_globalThis.stringMatch(
          eve.get || (eve.put || '')['.'],
          lex['.'] || lex['#'] || lex
        )
      ) {
        tmp.on('in', eve)
      }
      this.to.next(eve)
    })
    return tmp.$
  }
  Gun.chain.map = function (cb) {
    const gun = this
    const cat = gun._
    let lex
    let chain
    if (__usable_globalThis.objectPlain(cb)) {
      lex = cb['.']
        ? cb
        : {
            '.': cb
          }
      cb = undefined
    }
    if (!cb) {
      if ((chain = cat.each)) {
        return chain
      }
      (cat.each = chain = gun.chain())._.lex = lex || chain._.lex || cat.lex
      chain._.nix = gun.back('nix')
      gun.on('in', map, chain._)
      return chain
    }
    Gun.log.once(
      'mapfn',
      'Map functions are experimental, their behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it.'
    )
    chain = gun.chain()
    gun.map().on(function (data, key, msg, eve) {
      const next = (cb || noop).call(this, data, key, msg, eve)
      if (undefined === next) {
        return
      }
      if (data === next) {
        return chain._.on('in', msg)
      }
      if (Gun.is(next)) {
        return chain._.on('in', next._)
      }
      const tmp = {}
      Object.keys(msg.put).forEach((k) => {
        tmp[k] = msg.put[k]
      }, tmp)
      tmp['='] = next
      chain._.on('in', {
        get: key,
        put: tmp
      })
    })
    return chain
  }
  /**
	 *
	 * @param msg
	 */
  function map (msg) {
    this.to.next(msg)
    const cat = this.as
    const gun = msg.$
    const at = gun._
    const put = msg.put
    let tmp
    if (!at.soul && !msg.$) {
      return
    } // this line took hundreds of tries to figure out. It only works if core checks to filter out above chains during link tho. This says "only bother to map on a node" for this layer of the chain. If something is not a node, map should not work.
    if (
      (tmp = cat.lex) &&
			!__usable_globalThis.stringMatch(
			  msg.get || (put || '')['.'],
			  tmp['.'] || tmp['#'] || tmp
			)
    ) {
      return
    }
    Gun.on.link(msg, cat)
  }
  var noop = () => {}
}

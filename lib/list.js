import gunPlugin from '../gun.js'
import indexPlugin from '../index.js'
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

  var Gun = Gun || gunPlugin(__usable_environment)
  Gun.chain.list = function (cb, opt) {
    opt = opt || {}
    cb = cb || (() => {})
    const gun = this.put({}) // insert assumes a graph node. So either create it or merge with the existing one.
    gun.last = function (obj, cb) {
      const last = gun.path('last')
      if (!arguments.length) {
        return last
      }
      return gun
        .path('last')
        .put(null)
        .put(obj)
        .val(function (val) {
          // warning! these are not transactional! They could be.
          __usable_globalThis.debug.log('last is', val)
          last.path('next').put(this._.node, cb)
        })
    }
    gun.first = function (obj, cb) {
      const first = gun.path('first')
      if (!arguments.length) {
        return first
      }
      return gun
        .path('first')
        .put(null)
        .put(obj)
        .val(function () {
          // warning! these are not transactional! They could be.
          first.path('prev').put(this._.node, cb)
        })
    }
    return gun
  };
  (() => {
    // list tests

    const Gun = indexPlugin(__usable_environment)
    const gun = Gun({
      file: 'data.json'
    })
    const list = gun.list()
  })()
}

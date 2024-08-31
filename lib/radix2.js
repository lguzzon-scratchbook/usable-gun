import gunPlugin from '../gun.js'
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
		  });
  (() => {
    /**
		 *
		 */
    function Radix () {
      const radix = (key, val, t) => {
        key = `${key}`
        if (!t && undefined !== val) {
          radix.last = key < radix.last ? radix.last : key
          delete (radix.$ || {})[_]
        }
        t = t || radix.$ || (radix.$ = {})
        if (!key && Object.keys(t).length) {
          return t
        }
        let i = 0
        const l = key.length - 1
        let k = key[i]
        let at
        let tmp
        while (!(at = t[k]) && i < l) {
          k += key[++i]
        }
        radix.at = t /// caching to external access.
        if (!at) {
          if (
            !map(t, (r, s) => {
              let ii = 0
              let kk = ''
              if ((s || '').length) {
                while (s[ii] == key[ii]) {
                  kk += s[ii++]
                }
              }
              if (kk) {
                if (undefined === val) {
                  if (ii <= l) {
                    return
                  }
                  return ((tmp || (tmp = {}))[s.slice(ii)] = r)
                }
                const __ = {}
                __[s.slice(ii)] = r
                ii = key.slice(ii)
                ii === '' ? (__[''] = val) : ((__[ii] = {})[''] = val)
                t[kk] = __
                delete t[s]
                return true
              }
            })
          ) {
            if (undefined === val) {
              return
            }
            (t[k] || (t[k] = {}))[''] = val
          }
          if (undefined === val) {
            return tmp
          }
        } else if (i == l) {
          if (undefined === val) {
            return undefined === (tmp = at['']) ? at : tmp
          }
          at[''] = val
        } else {
          if (undefined !== val) {
            delete at[_]
          }
          return radix(key.slice(++i), val, at || (at = {}))
        }
      }
      return radix
    }
    Radix.map = function map (radix, cb, opt, pre) {
      pre = pre || []
      const t = typeof radix === 'function' ? radix.$ || {} : radix
      if (!t) {
        return
      }
      let keys =
				(t[_] || no).sort ||
				(t[_] = (function $ () {
				  $.sort = Object.keys(t).sort()
				  return $
				})()).sort
      // var keys = Object.keys(t).sort();
      opt =
				opt === true
				  ? {
				      branch: true
				    }
				  : opt || {}
      if (opt.reverse) {
        keys = keys.slice().reverse()
      }
      const start = opt.start
      const end = opt.end
      let i = 0
      const l = keys.length
      for (; i < l; i++) {
        const key = keys[i]
        const tree = t[key]
        var tmp
        var p
        var pt
        if (!tree || key === '' || _ === key) {
          continue
        }
        p = pre.slice()
        p.push(key)
        pt = p.join('')
        if (undefined !== start && pt < (start || '').slice(0, pt.length)) {
          continue
        }
        if (undefined !== end && (end || '\uffff') < pt) {
          continue
        }
        if (undefined !== (tmp = tree[''])) {
          tmp = cb(tmp, pt, key, pre)
          if (undefined !== tmp) {
            return tmp
          }
        } else if (opt.branch) {
          tmp = cb(undefined, pt, key, pre)
          if (undefined !== tmp) {
            return tmp
          }
        }
        pre = p
        tmp = map(tree, cb, opt, pre)
        if (undefined !== tmp) {
          return tmp
        }
        pre.pop()
      }
    }
    if (typeof __usable_window !== 'undefined') {
      var Gun = __usable_window.Gun
      __usable_window.Radix = Radix
    } else {
      var Gun = gunPlugin(__usable_environment)
      try {
        __usable_module.exports = Radix
      } catch (e) {}
    }
    var map = Gun.obj.map
    var no = {}
    var _ = String.fromCharCode(24)
  })()
  __usable_environment.exports.lib.radix2 = __usable_module.exports
  return __usable_module.exports
}

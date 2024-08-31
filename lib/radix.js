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
        radix.unit = 0
        if (!t && undefined !== val) {
          radix.last = `${key}` < radix.last ? radix.last : `${key}`
          delete (radix.$ || {})[_]
        }
        t = t || radix.$ || (radix.$ = {})
        if (!key && Object.keys(t).length) {
          return t
        }
        key = `${key}`
        let i = 0
        const l = key.length - 1
        let k = key[i]
        let at
        let tmp
        while (!(at = t[k]) && i < l) {
          k += key[++i]
        }
        if (!at) {
          if (
            !each(t, (r, s) => {
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
                  (tmp || (tmp = {}))[s.slice(ii)] = r
                  // (tmp[_] = function $(){ $.sort = Object.keys(tmp).sort(); return $ }()); // get rid of this one, cause it is on read?
                  return r
                }
                const __ = {}
                __[s.slice(ii)] = r
                ii = key.slice(ii)
                ii === '' ? (__[''] = val) : ((__[ii] = {})[''] = val)
                // (__[_] = function $(){ $.sort = Object.keys(__).sort(); return $ }());
                t[kk] = __
                if (Radix.debug && `${kk}` === 'undefined') {
                  __usable_globalThis.debug.log(0, kk)
                  debugger
                }
                delete t[s]
                // (t[_] = function $(){ $.sort = Object.keys(t).sort(); return $ }());
                return true
              }
            })
          ) {
            if (undefined === val) {
              return
            }
            (t[k] || (t[k] = {}))[''] = val
            if (Radix.debug && `${k}` === 'undefined') {
              __usable_globalThis.debug.log(1, k)
              debugger
            }
            // (t[_] = function $(){ $.sort = Object.keys(t).sort(); return $ }());
          }
          if (undefined === val) {
            return tmp
          }
        } else if (i == l) {
          // if(u === val){ return (u === (tmp = at['']))? at : tmp } // THIS CODE IS CORRECT, below is
          if (undefined === val) {
            return undefined === (tmp = at['']) ? at : (radix.unit = 1) && tmp
          } // temporary help??
          at[''] = val
          // (at[_] = function $(){ $.sort = Object.keys(at).sort(); return $ }());
        } else {
          if (undefined !== val) {
            delete at[_]
          }
          // at && (at[_] = function $(){ $.sort = Object.keys(at).sort(); return $ }());
          return radix(key.slice(++i), val, at || (at = {}))
        }
      }
      return radix
    }
    Radix.map = function rap (radix, cb, opt, pre) {
      try {
        pre = pre || [] // TODO: BUG: most out-of-memory crashes come from here.
        const t = typeof radix === 'function' ? radix.$ || {} : radix
        //! opt && console.log("WHAT IS T?", JSON.stringify(t).length);
        if (!t) {
          return
        }
        if (typeof t === 'string') {
          if (Radix.debug) {
            throw ['BUG:', radix, cb, opt, pre]
          }
          return
        }

        let keys =
					(t[_] || no).sort ||
					(t[_] = (function $ () {
					  $.sort = Object.keys(t).sort()
					  return $
					})()).sort // ONLY 17% of ops are pre-sorted!

        let rev
        // var keys = Object.keys(t).sort();
        opt =
					opt === true
					  ? {
					      branch: true
					    }
					  : opt || {}
        if ((rev = opt.reverse)) {
          keys = keys.slice(0).reverse()
        }
        const start = opt.start
        const end = opt.end
        const END = '\uffff'
        let i = 0
        const l = keys.length
        for (; i < l; i++) {
          const key = keys[i]
          const tree = t[key]
          var tmp
          var p
          var pt
          if (!tree || key === '' || _ === key || key === 'undefined') {
            continue
          }
          p = pre.slice(0)
          p.push(key)
          pt = p.join('')
          if (undefined !== start && pt < (start || '').slice(0, pt.length)) {
            continue
          }
          if (undefined !== end && (end || END) < pt) {
            continue
          }
          if (rev) {
            // children must be checked first when going in reverse.
            tmp = rap(tree, cb, opt, p)
            if (undefined !== tmp) {
              return tmp
            }
          }
          if (undefined !== (tmp = tree[''])) {
            let yes = 1
            if (undefined !== start && pt < (start || '')) {
              yes = 0
            }
            if (undefined !== end && pt > (end || END)) {
              yes = 0
            }
            if (yes) {
              tmp = cb(tmp, pt, key, pre)
              if (undefined !== tmp) {
                return tmp
              }
            }
          } else if (opt.branch) {
            tmp = cb(undefined, pt, key, pre)
            if (undefined !== tmp) {
              return tmp
            }
          }
          pre = p
          if (!rev) {
            tmp = rap(tree, cb, opt, pre)
            if (undefined !== tmp) {
              return tmp
            }
          }
          pre.pop()
        }
      } catch (e) {
        __usable_globalThis.debug.error(e)
      }
    }
    if (typeof __usable_window !== 'undefined') {
      __usable_window.Radix = Radix
    } else {
      try {
        __usable_module.exports = Radix
      } catch (e) {}
    }

    var each = (Radix.object = (o, f, r) => {
      for (const k in o) {
        if (!o.hasOwnProperty(k)) {
          continue
        }
        if ((r = f(o[k], k)) !== undefined) {
          return r
        }
      }
    })

    var no = {}
    var _ = String.fromCharCode(24)
  })()
  __usable_environment.exports.lib.radix = __usable_module.exports
  return __usable_module.exports
}

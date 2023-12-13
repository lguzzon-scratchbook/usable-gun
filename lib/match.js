import gunTypePlugin from '../src/type'
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

  const Type = gunTypePlugin(__usable_environment)
  __usable_module.exports = (t, o) => {
    let r = false
    t = t || ''
    o = Type.text.is(o)
      ? {
          '=': o
        }
      : o || {} // {'~', '=', '*', '<', '>', '+', '-', '?', '!'} // ignore case, exactly equal, anything after, lexically larger, lexically lesser, added in, subtacted from, questionable fuzzy match, and ends with.
    if (Type.obj.has(o, '~')) {
      t = t.toLowerCase()
      o['='] = (o['='] || o['~']).toLowerCase()
    }
    if (Type.obj.has(o, '=')) {
      return t === o['=']
    }
    if (Type.obj.has(o, '*')) {
      if (t.slice(0, o['*'].length) === o['*']) {
        r = true
        t = t.slice(o['*'].length)
      } else {
        return false
      }
    }
    if (Type.obj.has(o, '!')) {
      if (t.slice(-o['!'].length) === o['!']) {
        r = true
      } else {
        return false
      }
    }
    if (Type.obj.has(o, '+')) {
      if (
        Type.list.map(Type.list.is(o['+']) ? o['+'] : [o['+']], (m) => {
          if (t.indexOf(m) >= 0) {
            r = true
          } else {
            return true
          }
        })
      ) {
        return false
      }
    }
    if (Type.obj.has(o, '-')) {
      if (
        Type.list.map(Type.list.is(o['-']) ? o['-'] : [o['-']], (m) => {
          if (t.indexOf(m) < 0) {
            r = true
          } else {
            return true
          }
        })
      ) {
        return false
      }
    }
    if (Type.obj.has(o, '>')) {
      if (t > o['>']) {
        r = true
      } else {
        return false
      }
    }
    if (Type.obj.has(o, '<')) {
      if (t < o['<']) {
        r = true
      } else {
        return false
      }
    }
    /**
		 *
		 * @param t
		 * @param f
		 */
    function fuzzy (t, f) {
      let n = -1
      let i = 0
      let c
      for (; (c = f[i++]);) {
        if (!~(n = t.indexOf(c, n + 1))) {
          return false
        }
      }
      return true
    } // via http://stackoverflow.com/questions/9206013/javascript-fuzzy-search
    if (Type.obj.has(o, '?')) {
      if (fuzzy(t, o['?'])) {
        r = true
      } else {
        return false
      }
    } // change name!
    return r
  }
  __usable_environment.exports.lib.match = __usable_module.exports
  return __usable_module.exports
}

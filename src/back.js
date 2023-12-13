import rootPlugin from './root.js'
let __usable_isActivated = false
/**
 *
 * @param __usable_environment
 * @param __usable_MODULE
 */
export default function (__usable_environment) {
  if (__usable_isActivated) return
  __usable_isActivated = true
  /* BEGIN WRAPPED GUN CODE */

  const Gun = rootPlugin(__usable_environment)
  Gun.chain.back = function (n, opt) {
    var tmp
    n = n || 1
    if (n === -1 || Infinity === n) {
      return this._.root.$
    } else if (n === 1) {
      return (this._.back || this._).$
    }
    const gun = this
    const at = gun._
    if (typeof n === 'string') {
      n = n.split('.')
    }
    if (n instanceof Array) {
      let i = 0
      const l = n.length
      var tmp = at
      for (i; i < l; i++) {
        tmp = (tmp || empty)[n[i]]
      }
      if (undefined !== tmp) {
        return opt ? gun : tmp
      } else if ((tmp = at.back)) {
        return tmp.$.back(n, opt)
      }
      return
    }
    if (typeof n === 'function') {
      let yes

      var tmp = {
        back: at
      }

      while ((tmp = tmp.back) && undefined === (yes = n(tmp, opt))) {}
      return yes
    }
    if (typeof n === 'number') {
      return (at.back || at).$.back(n - 1)
    }
    return this
  }
  var empty = {}
}

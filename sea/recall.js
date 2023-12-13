import userPlugin from './user.js'
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

  const User = userPlugin(__usable_environment)

  const SEA = User.SEA
  const Gun = User.GUN
  User.prototype.recall = function (opt, cb) {
    const gun = this
    const root = gun.back(-1)
    opt = opt || {}
    if (opt && opt.sessionStorage) {
      if (SEA.window) {
        try {
          let sS = {}
          sS = SEA.window.sessionStorage // TODO: FIX BUG putting on `.is`!
          if (sS) {
            root._.opt.remember = true;
            (gun.back('user')._.opt || opt).remember = true
            if (sS.recall || sS.pair) root.user().auth(JSON.parse(sS.pair), cb) // pair is more reliable than alias/pass
          }
        } catch (e) {}
      }
      return gun
    }
    /*
      TODO: copy mhelander's expiry code back in.
      Although, we should check with community,
      should expiry be core or a plugin?
    */
    return gun
  }
}

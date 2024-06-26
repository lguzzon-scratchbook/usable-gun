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

  const User = userPlugin(__usable_environment)

  const SEA = User.SEA
  const Gun = User.GUN
  const noop = () => {}

  // Well first we have to actually create a user. That is what this function does.
  User.prototype.create = function (...args) {
    const pair =
			typeof args[0] === 'object' && (args[0].pub || args[0].epub)
			  ? args[0]
			  : typeof args[1] === 'object' && (args[1].pub || args[1].epub)
			    ? args[1]
			    : null
    const alias =
			pair && (pair.pub || pair.epub)
			  ? pair.pub
			  : typeof args[0] === 'string'
			    ? args[0]
			    : null
    const pass =
			pair && (pair.pub || pair.epub)
			  ? pair
			  : alias && typeof args[1] === 'string'
			    ? args[1]
			    : null
    let cb = args.filter((arg) => typeof arg === 'function')[0] || null // cb now can stand anywhere, after alias/pass or pair
    let opt =
			args && args.length > 1 && typeof args[args.length - 1] === 'object'
			  ? args[args.length - 1]
			  : {} // opt is always the last parameter which typeof === 'object' and stands after cb

    const gun = this
    const cat = gun._
    const root = gun.back(-1)
    cb = cb || noop
    opt = opt || {}
    if (opt.check !== false) {
      let err
      if (!alias) {
        err = 'No user.'
      }
      if ((pass || '').length < 8) {
        err = 'Password too short!'
      }
      if (err) {
        cb({
          err: Gun.log(err)
        })
        return gun
      }
    }
    if (cat.ing) {
      (cb || noop)({
        err: Gun.log('User is already being created or authenticated!'),
        wait: true
      })
      return gun
    }
    cat.ing = true
    const act = {}
    act.a = (pubs) => {
      act.pubs = pubs
      if (pubs && !opt.already) {
        // If we can enforce that a user name is already taken, it might be nice to try, but this is not guaranteed.
        const ack = {
          err: Gun.log('User already created!')
        }
        cat.ing = false;
        (cb || noop)(ack)
        gun.leave()
        return
      }
      act.salt = __usable_globalThis.stringRandom(64) // pseudo-randomly create a salt, then use PBKDF2 function to extend the password with it.
      SEA.work(pass, act.salt, act.b) // this will take some short amount of time to produce a proof, which slows brute force attacks.
    }
    act.b = (proof) => {
      act.proof = proof
      pair ? act.c(pair) : SEA.pair(act.c) // generate a brand new key pair or use the existing.
    }
    act.c = (pair) => {
      let tmp
      act.pair = pair || {}
      if ((tmp = cat.root.user)) {
        tmp._.sea = pair
        tmp.is = {
          pub: pair.pub,
          epub: pair.epub,
          alias
        }
      }
      // the user's public key doesn't need to be signed. But everything else needs to be signed with it! // we have now automated it! clean up these extra steps now!
      act.data = {
        pub: pair.pub
      }
      act.d()
    }
    act.d = () => {
      act.data.alias = alias
      act.e()
    }
    act.e = () => {
      act.data.epub = act.pair.epub
      SEA.encrypt(
        {
          priv: act.pair.priv,
          epriv: act.pair.epriv
        },
        act.proof,
        act.f,
        {
          raw: 1
        }
      ) // to keep the private key safe, we AES encrypt it with the proof of work!
    }
    act.f = (auth) => {
      act.data.auth = JSON.stringify({
        ek: auth,
        s: act.salt
      })
      act.g(act.data.auth)
    }
    act.g = (auth) => {
      let tmp
      act.data.auth = act.data.auth || auth
      root
        .get((tmp = `~${act.pair.pub}`))
        .put(act.data)
        .on(act.h) // awesome, now we can actually save the user with their public key as their ID.
      const link = {}
      link[tmp] = {
        '#': tmp
      }
      root
        .get(`~@${alias}`)
        .put(link)
        .get(tmp)
        .on(act.i) // next up, we want to associate the alias with the public key. So we add it to the alias list.
    }
    act.h = (data, key, msg, eve) => {
      eve.off()
      act.h.ok = 1
      act.i()
    }
    act.i = (data, key, msg, eve) => {
      if (eve) {
        act.i.ok = 1
        eve.off()
      }
      if (!act.h.ok || !act.i.ok) {
        return
      }
      cat.ing = false
      cb({
        ok: 0,
        pub: act.pair.pub
      }) // callback that the user has been created. (Note: ok = 0 because we didn't wait for disk to ack)
      if (noop === cb) {
        pair ? gun.auth(pair) : gun.auth(alias, pass)
      } // if no callback is passed, auto-login after signing up.
    }
    root.get(`~@${alias}`).once(act.a)
    return gun
  }
  User.prototype.leave = function () {
    const gun = this
    const user = gun.back(-1)._.user
    if (user) {
      delete user.is
      delete user._.is
      delete user._.sea
    }
    if (SEA.window) {
      try {
        let sS = {}
        sS = SEA.window.sessionStorage
        delete sS.recall
        delete sS.pair
      } catch (e) {}
    }
    return gun
  }
}

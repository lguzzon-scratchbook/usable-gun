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
  // now that we have created a user, we want to authenticate them!
  User.prototype.auth = function (...args) {
    // TODO: this PR with arguments need to be cleaned up / refactored.
    let pair =
			typeof args[0] === 'object' && (args[0].pub || args[0].epub)
			  ? args[0]
			  : typeof args[1] === 'object' && (args[1].pub || args[1].epub)
			    ? args[1]
			    : null
    let alias = !pair && typeof args[0] === 'string' ? args[0] : null
    const pass =
			(alias || (pair && !(pair.priv && pair.epriv))) &&
			typeof args[1] === 'string'
			  ? args[1]
			  : null
    const cb = args.filter((arg) => typeof arg === 'function')[0] || null // cb now can stand anywhere, after alias/pass or pair
    const opt =
			args && args.length > 1 && typeof args[args.length - 1] === 'object'
			  ? args[args.length - 1]
			  : {} // opt is always the last parameter which typeof === 'object' and stands after cb

    const gun = this
    const cat = gun._
    const root = gun.back(-1)
    if (cat.ing) {
      (cb || noop)({
        err: Gun.log('User is already being created or authenticated!'),
        wait: true
      })
      return gun
    }
    cat.ing = true
    const act = {}
    let tries = 9
    act.a = (data) => {
      if (!data) {
        return act.b()
      }
      if (!data.pub) {
        const tmp = []
        Object.keys(data).forEach((k) => {
          if (k == '_') {
            return
          }
          tmp.push(data[k])
        })
        return act.b(tmp)
      }
      if (act.name) {
        return act.f(data)
      }
      act.c((act.data = data).auth)
    }
    act.b = (list) => {
      const get = (act.list = (act.list || []).concat(list || [])).shift()
      if (undefined === get) {
        if (act.name) {
          return act.err(
            'Your user account is not published for dApps to access, please consider syncing it online, or allowing local access by adding your device as a peer.'
          )
        }
        if (alias && tries--) {
          root.get(`~@${alias}`).once(act.a)
          return
        }
        return act.err('Wrong user or password.')
      }
      root.get(get).once(act.a)
    }
    act.c = (auth) => {
      if (undefined === auth) {
        return act.b()
      }
      if (typeof auth === 'string') {
        return act.c(obj_ify(auth))
      } // in case of legacy
      SEA.work(pass, (act.auth = auth).s, act.d, act.enc) // the proof of work is evidence that we've spent some time/effort trying to log in, this slows brute force.
    }
    act.d = (proof) => {
      SEA.decrypt(act.auth.ek, proof, act.e, act.enc)
    }
    act.e = (half) => {
      if (undefined === half) {
        if (!act.enc) {
          // try old format
          act.enc = {
            encode: 'utf8'
          }
          return act.c(act.auth)
        }
        act.enc = null // end backwards
        return act.b()
      }
      act.half = half
      act.f(act.data)
    }
    act.f = (pair) => {
      const half = act.half || {}
      const data = act.data || {}
      act.g(
        (act.lol = {
          pub: pair.pub || data.pub,
          epub: pair.epub || data.epub,
          priv: pair.priv || half.priv,
          epriv: pair.epriv || half.epriv
        })
      )
    }
    act.g = (pair) => {
      if (!pair || !pair.pub || !pair.epub) {
        return act.b()
      }
      act.pair = pair
      const user = root._.user
      let at = user._
      at.tag
      const upt = at.opt
      at = user._ = root.get(`~${pair.pub}`)._
      at.opt = upt
      // add our credentials in-memory only to our root user instance
      user.is = {
        pub: pair.pub,
        epub: pair.epub,
        alias: alias || pair.pub
      }
      at.sea = act.pair
      cat.ing = false
      try {
        if (
          pass &&
					undefined == (obj_ify(cat.root.graph[`~${pair.pub}`].auth) || '')[':']
        ) {
          opt.shuffle = opt.change = pass
        }
      } catch (e) {} // migrate UTF8 & Shuffle!
      opt.change ? act.z() : (cb || noop)(at)
      if (SEA.window && (gun.back('user')._.opt || opt).remember) {
        // TODO: this needs to be modular.
        try {
          let sS = {}
          sS = SEA.window.sessionStorage // TODO: FIX BUG putting on `.is`!
          sS.recall = true
          sS.pair = JSON.stringify(pair) // auth using pair is more reliable than alias/pass
        } catch (e) {}
      }
      try {
        if (root._.tag.auth) {
          // auth handle might not be registered yet
          root._.on('auth', at) // TODO: Deprecate this, emit on user instead! Update docs when you do.
        } else {
          setTimeout(() => {
            root._.on('auth', at)
          }, 1)
        } // if not, hackily add a timeout.
        // at.on('auth', at) // Arrgh, this doesn't work without event "merge" code, but "merge" code causes stack overflow and crashes after logging in & trying to write data.
      } catch (e) {
        Gun.log("Your 'auth' callback crashed with:", e)
      }
    }
    act.h = (data) => {
      if (!data) {
        return act.b()
      }
      alias = data.alias
      if (!alias) alias = data.alias = `~${pair.pub}`
      if (!data.auth) {
        return act.g(pair)
      }
      pair = null
      act.c((act.data = data).auth)
    }
    act.z = () => {
      // password update so encrypt private key using new pwd + salt
      act.salt = __usable_globalThis.stringRandom(64) // pseudo-random
      SEA.work(opt.change, act.salt, act.y)
    }
    act.y = (proof) => {
      SEA.encrypt(
        {
          priv: act.pair.priv,
          epriv: act.pair.epriv
        },
        proof,
        act.x,
        {
          raw: 1
        }
      )
    }
    act.x = (auth) => {
      act.w(
        JSON.stringify({
          ek: auth,
          s: act.salt
        })
      )
    }
    act.w = (auth) => {
      if (opt.shuffle) {
        // delete in future!
        __usable_globalThis.debug.log(
          'migrate core account from UTF8 & shuffle'
        )
        const tmp = {}
        Object.keys(act.data).forEach((k) => {
          tmp[k] = act.data[k]
        })
        delete tmp._
        tmp.auth = auth
        root.get(`~${act.pair.pub}`).put(tmp)
      } // end delete
      root
        .get(`~${act.pair.pub}`)
        .get('auth')
        .put(auth, cb || noop)
    }
    act.err = (e) => {
      const ack = {
        err: Gun.log(e || 'User cannot be found!')
      }
      cat.ing = false;
      (cb || noop)(ack)
    }
    act.plugin = (name) => {
      if (!(act.name = name)) {
        return act.err()
      }
      const tmp = [name]
      if (name[0] !== '~') {
        tmp[1] = `~${name}`
        tmp[2] = `~@${name}`
      }
      act.b(tmp)
    }
    if (pair) {
      if (pair.priv && pair.epriv) act.g(pair)
      else root.get(`~${pair.pub}`).once(act.h)
    } else if (alias) {
      root.get(`~@${alias}`).once(act.a)
    } else if (!alias && !pass) {
      SEA.name(act.plugin)
    }
    return gun
  }
  /**
	 *
	 * @param o
	 */
  function obj_ify (o) {
    if (typeof o !== 'string') {
      return o
    }
    try {
      o = JSON.parse(o)
    } catch (e) {
      o = {}
    }
    return o
  }
}

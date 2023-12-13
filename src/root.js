import shimPlugin from './shim.js'
import validPlugin from './valid.js'
import statePlugin from './state.js'
import ontoPlugin from './onto.js'
import dupPlugin from './dup.js'
import askPlugin from './ask.js'
let __usable_isActivated = false
const __usable_module = {}

/**
 *
 * @param __usable_environment
 * @param __usable_MODULE
 */
export default function (__usable_environment, __usable_MODULE) {
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
		  })
  /* BEGIN WRAPPED GUN CODE */

  /**
	 *
	 * @param o
	 */
  function Gun (o) {
    if (o instanceof Gun) {
      return (this._ = {
        $: this
      }).$
    }
    if (!(this instanceof Gun)) {
      return new Gun(o)
    }
    return Gun.create(
      (this._ = {
        $: this,
        opt: o
      })
    )
  }
  Gun.is = ($) => $ instanceof Gun || ($ && $._ && $ === $._.$) || false
  Gun.version = 0.202
  Gun.chain = Gun.prototype
  Gun.chain.toJSON = () => {}
  shimPlugin(__usable_environment)
  Gun.valid = validPlugin(__usable_environment)
  Gun.state = statePlugin(__usable_environment)
  Gun.on = ontoPlugin(__usable_environment)
  Gun.dup = dupPlugin(__usable_environment)
  Gun.ask = askPlugin(__usable_environment);
  (() => {
    Gun.create = (at) => {
      at.root = at.root || at
      at.graph = at.graph || {}
      at.on = at.on || Gun.on
      at.ask = at.ask || Gun.ask
      at.dup = at.dup || Gun.dup()
      const gun = at.$.opt(at.opt)
      if (!at.once) {
        at.on('in', universe, at)
        at.on('out', universe, at)
        at.on('put', map, at)
        Gun.on('create', at)
        at.on('create', at)
      }
      at.once = 1
      return gun
    }
    /**
		 *
		 * @param msg
		 */
    function universe (msg) {
      // TODO: BUG! msg.out = null being set!
      // if(!F){ var eve = this; setTimeout(function(){ universe.call(eve, msg,1) },Math.random() * 100);return; } // ADD F TO PARAMS!
      if (!msg) {
        return
      }
      if (msg.out === universe) {
        this.to.next(msg)
        return
      }
      const eve = this
      const as = eve.as
      const at = as.at || as
      const gun = at.$
      const dup = at.dup
      let tmp
      const DBG = msg.DBG;
      (tmp = msg['#']) || (tmp = msg['#'] = text_rand(9))
      if (dup.check(tmp)) {
        return
      }
      dup.track(tmp)
      tmp = msg._
      msg._ = typeof tmp === 'function' ? tmp : () => {};
      (msg.$ && msg.$ === (msg.$._ || '').$) || (msg.$ = gun)
      if (msg['@'] && !msg.put) {
        ack(msg)
      }
      if (!at.ask(msg['@'], msg)) {
        // is this machine listening for an ack?
        DBG && (DBG.u = Number(new Date()))
        if (msg.put) {
          put(msg)
          return
        } else if (msg.get) {
          Gun.on.get(msg, gun)
        }
      }
      DBG && (DBG.uc = Number(new Date()))
      eve.to.next(msg)
      DBG && (DBG.ua = Number(new Date()))
      if (msg.nts || msg.NTS) {
        return
      } // TODO: This shouldn't be in core, but fast way to prevent NTS spread. Delete this line after all peers have upgraded to newer versions.
      msg.out = universe
      at.on('out', msg)
      DBG && (DBG.ue = Number(new Date()))
    }
    /**
		 *
		 * @param msg
		 */
    function put (msg) {
      if (!msg) {
        return
      }
      const ctx = msg._ || ''
      const root = (ctx.root = ((ctx.$ = msg.$ || '')._ || '').root)
      if (msg['@'] && ctx.faith && !ctx.miss) {
        // TODO: AXE may split/route based on 'put' what should we do here? Detect @ in AXE? I think we don't have to worry, as DAM will route it on @.
        msg.out = universe
        root.on('out', msg)
        return
      }
      ctx.latch = root.hatch
      ctx.match = root.hatch = []
      const put = msg.put
      const DBG = (ctx.DBG = msg.DBG)
      const S = Number(new Date())
      CT = CT || S
      if (put['#'] && put['.']) {
        /* root && root.on('put', msg); */ return
      } // TODO: BUG! This needs to call HAM instead.
      DBG && (DBG.p = S)
      ctx['#'] = msg['#']
      ctx.msg = msg
      ctx.all = 0
      ctx.stun = 1
      const nl = Object.keys(put) // .sort(); // TODO: This is unbounded operation, large graphs will be slower. Write our own CPU scheduled sort? Or somehow do it in below? Keys itself is not O(1) either, create ES5 shim over ?weak map? or custom which is constant.
      __usable_globalThis.debug.STAT &&
				__usable_globalThis.debug.STAT(
				  S,
				  ((DBG || ctx).pk = Number(new Date())) - S,
				  'put sort'
				)
      let ni = 0
      let nj
      let kl
      let soul
      let node
      let states
      let err
      let tmp;
      (function pop (o) {
        if (nj != ni) {
          nj = ni
          if (!(soul = nl[ni])) {
            __usable_globalThis.debug.STAT &&
							__usable_globalThis.debug.STAT(
							  S,
							  ((DBG || ctx).pd = Number(new Date())) - S,
							  'put'
							)
            fire(ctx)
            return
          }
          if (!(node = put[soul])) {
            err = `${ERR + cut(soul)}no node.`
          } else if (!(tmp = node._)) {
            err = `${ERR + cut(soul)}no meta.`
          } else if (soul !== tmp['#']) {
            err = `${ERR + cut(soul)}soul not same.`
          } else if (!(states = tmp['>'])) {
            err = `${ERR + cut(soul)}no state.`
          }
          kl = Object.keys(node || {}) // TODO: .keys( is slow
        }
        if (err) {
          msg.err = ctx.err = err // invalid data should error and stun the message.
          fire(ctx)
          // console.log("handle error!", err) // handle!
          return
        }
        let i = 0
        let key
        o = o || 0
        while (o++ < 9 && (key = kl[i++])) {
          if (key === '_') {
            continue
          }
          const val = node[key]
          const state = states[key]
          if (undefined === state) {
            err = `${ERR + cut(key)}on${cut(soul)}no state.`
            break
          }
          if (!valid(val)) {
            err =
							`${ERR +
							cut(key)
							}on${
								cut(soul)
							}bad ${
								typeof val
							}${cut(val)}`
            break
          }
          // ctx.all++; //ctx.ack[soul+key] = '';
          ham(val, key, soul, state, msg)
          ++C // courtesy count;
        }
        if ((kl = kl.slice(i)).length) {
          turn(pop)
          return
        }
        ++ni
        kl = null
        pop(o)
      })()
    }
    Gun.on.put = put
    // TODO: MARK!!! clock below, reconnect sync, SEA certify wire merge, User.auth taking multiple times, // msg put, put, say ack, hear loop...
    // WASIS BUG! local peer not ack. .off other people: .open
    /**
		 *
		 * @param val
		 * @param key
		 * @param soul
		 * @param state
		 * @param msg
		 */
    function ham (val, key, soul, state, msg) {
      const ctx = msg._ || ''
      const root = ctx.root
      const graph = root.graph
      let tmp
      const vertex = graph[soul] || empty
      const was = state_is(vertex, key, 1)
      const known = vertex[key]
      const DBG = ctx.DBG
      if ((tmp = __usable_globalThis.debug.STAT)) {
        if (!graph[soul] || !known) {
          tmp.has = (tmp.has || 0) + 1
        }
      }
      const now = State()
      if (state > now) {
        setTimeout(
          () => {
            ham(val, key, soul, state, msg)
          },
          (tmp = state - now) > MD ? MD : tmp
        ) // Max Defer 32bit. :(
        __usable_globalThis.debug.STAT &&
					__usable_globalThis.debug.STAT(
					  ((DBG || ctx).Hf = Number(new Date())),
					  tmp,
					  'future'
					)
        return
      }
      if (state < was) {
        /* old; */
        return
      } // but some chains have a cache miss that need to re-fire. // TODO: Improve in future. // for AXE this would reduce rebroadcast, but GUN does it on message forwarding. // TURNS OUT CACHE MISS WAS NOT NEEDED FOR NEW CHAINS ANYMORE!!! DANGER DANGER DANGER, ALWAYS RETURN! (or am I missing something?)
      if (!ctx.faith) {
        // TODO: BUG? Can this be used for cache miss as well? // Yes this was a bug, need to check cache miss for RAD tests, but should we care about the faith check now? Probably not.
        if (state === was && (val === known || L(val) <= L(known))) {
          /* console.log("same"); */ /* same; */ if (!ctx.miss) {
            return
          }
        } // same
      }
      ctx.stun++ // TODO: 'forget' feature in SEA tied to this, bad approach, but hacked in for now. Any changes here must update there.
      const aid = msg['#'] + ctx.all++

      const id = {
        toString () {
          return aid
        },
        _: ctx
      }

      id.toJSON = id.toString // this *trick* makes it compatible between old & new versions.
      root.dup.track(id)['#'] = msg['#'] // fixes new OK acks for RPC like RTC.
      DBG && (DBG.ph = DBG.ph || Number(new Date()))
      root.on('put', {
        '#': id,
        '@': msg['@'],
        put: {
          '#': soul,
          '.': key,
          ':': val,
          '>': state
        },
        ok: msg.ok,
        _: ctx
      })
    }
    /**
		 *
		 * @param msg
		 */
    function map (msg) {
      let DBG
      if ((DBG = (msg._ || '').DBG)) {
        DBG.pa = Number(new Date())
        DBG.pm = DBG.pm || Number(new Date())
      }
      const eve = this
      const root = eve.as
      const graph = root.graph
      const ctx = msg._
      const put = msg.put
      const soul = put['#']
      const key = put['.']
      const val = put[':']
      const state = put['>']
      const id = msg['#']
      let tmp
      if ((tmp = ctx.msg) && (tmp = tmp.put) && (tmp = tmp[soul])) {
        state_ify(tmp, key, state, val, soul)
      } // necessary! or else out messages do not get SEA transforms.
      // var bytes = ((graph[soul]||'')[key]||'').length||1;
      graph[soul] = state_ify(graph[soul], key, state, val, soul)
      if ((tmp = (root.next || '')[soul])) {
        // tmp.bytes = (tmp.bytes||0) + ((val||'').length||1) - bytes;
        // if(tmp.bytes > 2**13){ Gun.log.once('byte-limit', "Note: In the future, GUN peers will enforce a ~4KB query limit. Please see https://gun.eco/docs/Page") }
        tmp.on('in', msg)
      }
      fire(ctx)
      eve.to.next(msg)
    }
    /**
		 *
		 * @param ctx
		 * @param msg
		 */
    function fire (ctx, msg) {
      let root
      if (ctx.stop) {
        return
      }
      if (!ctx.err && --ctx.stun > 0) {
        return
      } // TODO: 'forget' feature in SEA tied to this, bad approach, but hacked in for now. Any changes here must update there.
      ctx.stop = 1
      if (!(root = ctx.root)) {
        return
      }
      let tmp = ctx.match
      tmp.end = 1
      if (tmp === root.hatch) {
        if (!(tmp = ctx.latch) || tmp.end) {
          delete root.hatch
        } else {
          root.hatch = tmp
        }
      }
      ctx.hatch && ctx.hatch() // TODO: rename/rework how put & this interact.
      __usable_globalThis.settimeoutEach(ctx.match, (cb) => {
        cb && cb()
      })
      if (!(msg = ctx.msg) || ctx.err || msg.err) {
        return
      }
      msg.out = universe
      ctx.root.on('out', msg)
      CF() // courtesy check;
    }
    /**
		 *
		 * @param msg
		 */
    function ack (msg) {
      // aggregate ACKs.
      const id = msg['@'] || ''

      let ctx
      if (!(ctx = id._)) {
        var dup =
					(dup = msg.$) && (dup = dup._) && (dup = dup.root) && (dup = dup.dup)
        if (!(dup = dup.check(id))) {
          return
        }
        msg['@'] = dup['#'] || msg['@'] // This doesn't do anything anymore, backtrack it to something else?
        return
      }
      ctx.acks = (ctx.acks || 0) + 1
      if ((ctx.err = msg.err)) {
        msg['@'] = ctx['#']
        fire(ctx) // TODO: BUG? How it skips/stops propagation of msg if any 1 item is error, this would assume a whole batch/resync has same malicious intent.
      }
      ctx.ok = msg.ok || ctx.ok
      if (!ctx.stop && !ctx.crack) {
        ctx.crack =
					ctx.match &&
					ctx.match.push(() => {
					  back(ctx)
					})
      } // handle synchronous acks. NOTE: If a storage peer ACKs synchronously then the PUT loop has not even counted up how many items need to be processed, so ctx.STOP flags this and adds only 1 callback to the end of the PUT loop.
      back(ctx)
    }
    /**
		 *
		 * @param ctx
		 */
    function back (ctx) {
      if (!ctx || !ctx.root) {
        return
      }
      if (ctx.stun || ctx.acks !== ctx.all) {
        return
      }
      ctx.root.on('in', {
        '@': ctx['#'],
        err: ctx.err,
        ok: ctx.err
          ? undefined
          : ctx.ok || {
            '': 1
          }
      })
    }
    var ERR = 'Error: Invalid graph!'
    var cut = (s) => ` '${(`${s}`).slice(0, 9)}...' `
    var L = JSON.stringify
    var MD = 2147483647
    var State = Gun.state
    var C = 0
    let CT

    var CF = () => {
      if (C > 999 && C / -(CT - (CT = Number(new Date()))) > 1) {
        Gun.window &&
					__usable_globalThis.debug.log(
					  "Warning: You're syncing 1K+ records a second, faster than DOM can update - consider limiting query."
					)
        CF = () => {
          C = 0
        }
      }
    }
  })();
  (() => {
    Gun.on.get = (msg, gun) => {
      const root = gun._
      const get = msg.get
      const soul = get['#']
      let node = root.graph[soul]
      const has = get['.']
      const next = root.next || (root.next = {})
      const at = next[soul]

      // TODO: Azarattum bug, what is in graph is not same as what is in next. Fix!

      // queue concurrent GETs?
      // TODO: consider tagging original message into dup for DAM.
      // TODO: ^ above? In chat app, 12 messages resulted in same peer asking for `#user.pub` 12 times. (same with #user GET too, yipes!) // DAM note: This also resulted in 12 replies from 1 peer which all had same ##hash but none of them deduped because each get was different.
      // TODO: Moving quick hacks fixing these things to axe for now.
      // TODO: a lot of GET #foo then GET #foo."" happening, why?
      // TODO: DAM's ## hash check, on same get ACK, producing multiple replies still, maybe JSON vs YSON?
      // TMP note for now: viMZq1slG was chat LEX query #.
      /* if(gun !== (tmp = msg.$) && (tmp = (tmp||'')._)){
      	if(tmp.Q){ tmp.Q[msg['#']] = ''; return } // chain does not need to ask for it again.
      	tmp.Q = {};
      } */
      /* if(u === has){
      	if(at.Q){
      		//at.Q[msg['#']] = '';
      		//return;
      	}
      	at.Q = {};
      } */
      const ctx = msg._ || {}

      const DBG = (ctx.DBG = msg.DBG)
      DBG && (DBG.g = Number(new Date()))
      // console.log("GET:", get, node, has, at);
      // if(!node && !at){ return root.on('get', msg) }
      // if(has && node){ // replace 2 below lines to continue dev?
      if (!node) {
        return root.on('get', msg)
      }
      if (has) {
        if (typeof has !== 'string' || undefined === node[has]) {
          if (!((at || '').next || '')[has]) {
            root.on('get', msg)
            return
          }
        }
        node = state_ify({}, has, state_is(node, has), node[has], soul)
        // If we have a key in-memory, do we really need to fetch?
        // Maybe... in case the in-memory key we have is a local write
        // we still need to trigger a pull/merge from peers.
      }
      // Gun.window? Gun.obj.copy(node) : node; // HNPERF: If !browser bump Performance? Is this too dangerous to reference root graph? Copy / shallow copy too expensive for big nodes. Gun.obj.to(node); // 1 layer deep copy // Gun.obj.copy(node); // too slow on big nodes
      node && ack(msg, node)
      root.on('get', msg) // send GET to storage adapters.
    }
    /**
		 *
		 * @param msg
		 * @param node
		 */
    function ack (msg, node) {
      let S = Number(new Date())
      const ctx = msg._ || {}
      const DBG = (ctx.DBG = msg.DBG)
      const to = msg['#']
      let id = text_rand(9)
      let keys = Object.keys(node || '').sort()
      const soul = ((node || '')._ || '')['#']
      const kl = keys.length
      const root = msg.$._.root
      const F = node === root.graph[soul]
      __usable_globalThis.debug.STAT &&
				__usable_globalThis.debug.STAT(
				  S,
				  ((DBG || ctx).gk = Number(new Date())) - S,
				  'got keys'
				)
      // PERF: Consider commenting this out to force disk-only reads for perf testing? // TODO: .keys( is slow
      node &&
				(function go () {
				  S = Number(new Date())
				  let i = 0
				  let k
				  let put = {}
				  let tmp
				  while (i < 9 && (k = keys[i++])) {
				    state_ify(put, k, state_is(node, k), node[k], soul)
				  }
				  keys = keys.slice(i);
				  (tmp = {})[soul] = put
				  put = tmp
				  let faith
				  if (F) {
				    faith = () => {}
				    faith.ram = faith.faith = true
				  } // HNPERF: We're testing performance improvement by skipping going through security again, but this should be audited.
				  tmp = keys.length
				  __usable_globalThis.debug.STAT &&
						__usable_globalThis.debug.STAT(
						  S,
						  -(S - (S = Number(new Date()))),
						  'got copied some'
						)
				  DBG && (DBG.ga = Number(new Date()))
				  root.on('in', {
				    '@': to,
				    '#': id,
				    put,
				    '%': tmp ? (id = text_rand(9)) : undefined,
				    $: root.$,
				    _: faith,
				    DBG,
				    FOO: 1
				  })
				  __usable_globalThis.debug.STAT &&
						__usable_globalThis.debug.STAT(S, Number(new Date()) - S, 'got in')
				  if (!tmp) {
				    return
				  }
				  __usable_globalThis.settimeoutTurn(go)
				})()
      if (!node) {
        root.on('in', {
          '@': msg['#']
        })
      } // TODO: I don't think I like this, the default lS adapter uses this but "not found" is a sensitive issue, so should probably be handled more carefully/individually.
    }
    Gun.on.get.ack = ack
  })();
  (() => {
    Gun.chain.opt = function (opt) {
      opt = opt || {}
      const gun = this
      const at = gun._
      let tmp = opt.peers || opt
      if (!__usable_globalThis.objectPlain(opt)) {
        opt = {}
      }
      if (!__usable_globalThis.objectPlain(at.opt)) {
        at.opt = opt
      }
      if (typeof tmp === 'string') {
        tmp = [tmp]
      }
      if (!__usable_globalThis.objectPlain(at.opt.peers)) {
        at.opt.peers = {}
      }
      if (tmp instanceof Array) {
        opt.peers = {}
        tmp.forEach((url) => {
          const p = {}
          p.id = p.url = url
          opt.peers[url] = at.opt.peers[url] = at.opt.peers[url] || p
        })
      }
      obj_each(opt, function each (k) {
        const v = this[k]
        if (
          (this && this.hasOwnProperty(k)) ||
					typeof v === 'string' ||
					__usable_globalThis.objectEmpty(v)
        ) {
          this[k] = v
          return
        }
        if (v && v.constructor !== Object && !(v instanceof Array)) {
          return
        }
        obj_each(v, each)
      })
      at.opt.from = opt
      Gun.on('opt', at)
      at.opt.uuid =
				at.opt.uuid ||
				function uuid (l) {
				  return (
				    Gun.state().toString(36).replace('.', '') +
						__usable_globalThis.stringRandom(l || 12)
				  )
				}
      return gun
    }
  })()

  var obj_each = (o, f) => {
    Object.keys(o).forEach(f, o)
  }

  var text_rand = __usable_globalThis.stringRandom
  var turn = __usable_globalThis.settimeoutTurn
  var valid = Gun.valid
  var state_is = Gun.state.is
  var state_ify = Gun.state.ify
  var empty = {}
  let C
  Gun.log = function (...args) {
    return !Gun.log.off && C.log(...args), [].slice.call(args).join(' ')
  }
  Gun.log.once = (w, s, o) => (
    ((o = Gun.log.once)[w] = o[w] || 0), o[w]++ || Gun.log(s)
  )
  if (typeof __usable_window !== 'undefined') {
    (__usable_window.GUN = __usable_window.Gun = Gun).window = __usable_window
  }
  try {
    if (typeof __usable_MODULE !== 'undefined') {
      __usable_MODULE.exports = Gun
    }
  } catch (e) {}
  __usable_module.exports = Gun;
  (Gun.window || {}).debug = (Gun.window || {}).debug || {
    log () {}
  };
  (C = __usable_globalThis.debug).only = function (i, s) {
    return (
      C.only.i && i === C.only.i && C.only.i++ && (C.log(...arguments) || s)
    )
  };
  ('Please do not remove welcome log unless you are paying for a monthly sponsorship, thanks!')
  /* Moved to GunEnvironment :) */

  __usable_environment.exports.gun.root = __usable_module.exports
  return __usable_module.exports
}

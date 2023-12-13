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

  const Gun = rootPlugin(__usable_environment)
  Gun.chain.put = function (data, cb, as) {
    // I rewrote it :)
    const gun = this

    const at = gun._
    const root = at.root
    as = as || {}
    as.root = at.root
    as.run || (as.run = root.once)
    stun(as, at.id) // set a flag for reads to check if this chain is writing.
    as.ack = as.ack || cb
    as.via = as.via || gun
    as.data = as.data || data
    as.soul || (as.soul = at.soul || (typeof cb === 'string' && cb))
    const s = (as.state = as.state || Gun.state())
    if (typeof data === 'function') {
      data((d) => {
        as.data = d
        gun.put(undefined, undefined, as)
      })
      return gun
    }
    if (!as.soul) {
      return get(as), gun
    }
    as.$ = root.$.get(as.soul) // TODO: This may not allow user chaining and similar?
    as.todo = [
      {
        it: as.data,
        ref: as.$
      }
    ]
    as.turn = as.turn || turn
    as.ran = as.ran || ran;
    // var path = []; as.via.back(at => { at.get && path.push(at.get.slice(0,9)) }); path = path.reverse().join('.');
    // TODO: Perf! We only need to stun chains that are being modified, not necessarily written to.
    (function walk () {
      const to = as.todo
      const at = to.pop()
      let d = at.it
      const cid = at.ref && at.ref._.id
      let v
      let k
      let cat
      let tmp
      let g
      stun(as, at.ref)
      if ((tmp = at.todo)) {
        k = tmp.pop()
        d = d[k]
        if (tmp.length) {
          to.push(at)
        }
      }
      k && (to.path || (to.path = [])).push(k)
      if (!(v = valid(d)) && !(g = Gun.is(d))) {
        if (!__usable_globalThis.objectPlain(d)) {
          ran.err(
            as,
						`Invalid data: ${
							check(d)
						} at ${
							as.via.back(
								(at) => {
									at.get && tmp.push(at.get)
								},
								(tmp = [])
							) || tmp.join('.')
						}.${
							(to.path || []).join('.')}`
          )
          return
        }
        const seen = as.seen || (as.seen = [])
        let i = seen.length
        while (i--) {
          if (d === (tmp = seen[i]).it) {
            v = d = tmp.link
            break
          }
        }
      }
      if (k && v) {
        at.node = state_ify(at.node, k, s, d)
      } // handle soul later.
      else {
        if (!as.seen) {
          ran.err(as, 'Data at root of graph must be a node (an object).')
          return
        }
        as.seen.push(
          (cat = {
            it: d,
            link: {},
            todo: g ? [] : Object.keys(d).sort().reverse(),
            path: (to.path || []).slice(),
            up: at
          })
        ) // Any perf reasons to CPU schedule this .keys( ?
        at.node = state_ify(at.node, k, s, cat.link)
        !g && cat.todo.length && to.push(cat)
        // ---------------
        const id = as.seen.length;
        (as.wait || (as.wait = {}))[id] = ''
        tmp = (cat.ref = g ? d : k ? at.ref.get(k) : at.ref)._;
        (tmp = (d && (d._ || '')['#']) || tmp.soul || tmp.link)
          ? resolve({
            soul: tmp
          })
          : cat.ref.get(resolve, {
            run: as.run,
            /* hatch: 0, */ v2020: 1,
            out: {
              get: {
                '.': ' '
              }
            }
          }) // TODO: BUG! This should be resolve ONLY soul to prevent full data from being loaded. // Fixed now?
        // setTimeout(function(){ if(F){ return } console.log("I HAVE NOT BEEN CALLED!", path, id, cat.ref._.id, k) }, 9000); var F; // MAKE SURE TO ADD F = 1 below!
        /**
				 *
				 * @param msg
				 * @param eve
				 */
        function resolve (msg, eve) {
          const end = cat.link['#']
          if (eve) {
            eve.off()
            eve.rid(msg)
          } // TODO: Too early! Check all peers ack not found.
          // TODO: BUG maybe? Make sure this does not pick up a link change wipe, that it uses the changign link instead.
          let soul =
						end ||
						msg.soul ||
						(tmp = (msg.$ || msg.$)._ || '').soul ||
						tmp.link ||
						((tmp = tmp.put || '')._ || '')['#'] ||
						tmp['#'] ||
						((tmp = msg.put || '') && msg.$
						  ? tmp['#']
						  : (tmp['='] || tmp[':'] || '')['#'])
          !end && stun(as, msg.$)
          if (!soul && !at.link['#']) {
            // check soul link above us
            (at.wait || (at.wait = [])).push(() => {
              resolve(msg, eve)
            }) // wait
            return
          }
          if (!soul) {
            soul = [];
            (msg.$ || msg.$).back((at) => {
              if ((tmp = at.soul || at.link)) {
                return soul.push(tmp)
              }
              soul.push(at.get)
            })
            soul = soul.reverse().join('/')
          }
          cat.link['#'] = soul
          !g &&
						(((as.graph || (as.graph = {}))[soul] =
							cat.node ||
							(cat.node = {
							  _: {}
							}))._['#'] = soul)
          delete as.wait[id]
          cat.wait &&
						__usable_globalThis.settimeoutEach(cat.wait, (cb) => {
						  cb && cb()
						})
          as.ran(as)
        }

        // ---------------
      }
      if (!to.length) {
        return as.ran(as)
      }
      as.turn(walk)
    })()
    return gun
  }
  /**
	 *
	 * @param as
	 * @param id
	 */
  function stun (as, id) {
    if (!id) {
      return
    }
    id = (id._ || '').id || id

    const run =
			as.root.stun ||
			(as.root.stun = {
			  on: Gun.on
			})

    const test = {}
    let tmp
    as.stun || (as.stun = run.on('stun', () => {}))
    if ((tmp = run.on(`${id}`))) {
      tmp.the.last.next(test)
    }
    if (test.run >= as.run) {
      return
    }
    run.on(`${id}`, function (test) {
      if (as.stun.end) {
        this.off()
        this.to.next(test)
        return
      }
      test.run = test.run || as.run
      test.stun = test.stun || as.stun
    })
  }
  /**
	 *
	 * @param as
	 */
  function ran (as) {
    if (as.err) {
      ran.end(as.stun, as.root)
      return
    } // move log handle here.
    if (as.todo.length || as.end || !__usable_globalThis.objectEmpty(as.wait)) {
      return
    }
    as.end = 1

    // (as.retry = function(){ as.acks = 0;
    const cat = as.$.back(-1)._

    const root = cat.root

    const ask = cat.ask(function (ack) {
      root.on('ack', ack)
      if (ack.err && !ack.lack) {
        Gun.log(ack)
      }
      if (++acks > (as.acks || 0)) {
        this.off()
      } // Adjustable ACKs! Only 1 by default.
      if (!as.ack) {
        return
      }
      as.ack(ack, this)
    }, as.opt)

    var acks = 0
    let stun = as.stun
    let tmp;
    (tmp = () => {
      // this is not official yet, but quick solution to hack in for now.
      if (!stun) {
        return
      }
      ran.end(stun, root)
      __usable_globalThis.settimeoutEach(
        Object.keys((stun = stun.add || '')),
        (cb) => {
          if ((cb = stun[cb])) {
            cb()
          }
        }
      ) // resume the stunned reads // Any perf reasons to CPU schedule this .keys( ?
    }).hatch = tmp // this is not official yet ^
    // console.log(1, "PUT", as.run, as.graph);
    if (as.ack && !as.ok) {
      as.ok = as.acks || 9
    } // TODO: In future! Remove this! This is just old API support.
    as.via._.on('out', {
      put: (as.out = as.graph),
      ok: as.ok && {
        '@': as.ok + 1
      },
      opt: as.opt,
      '#': ask,
      _: tmp
    })
    // })();
  }
  ran.end = (stun, root) => {
    stun.end = noop // like with the earlier id, cheaper to make this flag a function so below callbacks do not have to do an extra type check.
    if (stun.the.to === stun && stun === stun.the.last) {
      delete root.stun
    }
    stun.off()
  }
  ran.err = (as, err) => {
    (as.ack || noop).call(
      as,
      (as.out = {
        err: (as.err = Gun.log(err))
      })
    )
    as.ran(as)
  }
  /**
	 *
	 * @param as
	 */
  function get (as) {
    const at = as.via._
    let tmp
    as.via = as.via.back((at) => {
      if (at.soul || !at.get) {
        return at.$
      }
      tmp = as.data;
      (as.data = {})[at.get] = tmp
    })
    if (!as.via || !as.via._.soul) {
      as.via = at.root.$.get(
        ((as.data || '')._ || '')['#'] || at.$.back('opt.uuid')()
      )
    }
    as.via.put(as.data, as.ack, as)
  }
  /**
	 *
	 * @param d
	 * @param tmp
	 */
  function check (d, tmp) {
    return (d && (tmp = d.constructor) && tmp.name) || typeof d
  }
  const empty = {}
  var noop = () => {}
  var turn = __usable_globalThis.settimeoutTurn
  var valid = Gun.valid
  var state_ify = Gun.state.ify
}

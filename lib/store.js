import gunPlugin from '../gun.js'
import radiskPlugin from './radisk.js'
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
  const __usable_process =
		__usable_environment.environmentHint !== 'server'
		  ? undefined
		  : 'process' in globalThis
		    ? process
		    : {
		        env: {},
		        uptime: () => {},
		        cpuUsage: () => {},
		        memoryUsage: () => {}
		      }
  /* BEGIN WRAPPED GUN CODE */

  const Gun =
		typeof __usable_window !== 'undefined'
		  ? __usable_window.Gun
		  : gunPlugin(__usable_environment)
  Gun.on('create', function (root) {
    if (Gun.TESTING) {
      root.opt.file = 'radatatest'
    }
    this.to.next(root)
    const opt = root.opt
    if (opt.rad === false || opt.radisk === false) {
      return
    }
    if (
      typeof __usable_process !== 'undefined' &&
			`${(__usable_process.env || '').RAD}` === 'false'
    ) {
      return
    }
    const Radisk =
			(Gun.window && Gun.window.Radisk) || radiskPlugin(__usable_environment)
    const Radix = Radisk.Radix
    const dare = Radisk(opt)
    const esc = String.fromCharCode(27)
    let ST = 0
    root.on('put', function (msg) {
      this.to.next(msg)
      if ((msg._ || '').rad) {
        return
      } // don't save what just came from a read.

      // if(msg['@']){ return } // WHY DID I NOT ADD THIS?
      const id = msg['#']

      const put = msg.put
      const soul = put['#']
      const key = put['.']
      const val = put[':']
      const state = put['>']
      const DBG = (msg._ || '').DBG
      DBG && (DBG.sp = DBG.sp || Number(new Date()))
      // var lot = (msg._||'').lot||''; count[id] = (count[id] || 0) + 1;
      const S = (msg._ || '').RPS || ((msg._ || '').RPS = Number(new Date()))
      // console.log("PUT ------->>>", soul,key, val, state);
      // dare(soul+esc+key, {':': val, '>': state}, dare.one[id] || function(err, ok){
      dare(
        soul + esc + key,
        {
          ':': val,
          '>': state
        },
        (err, ok) => {
          // console.log("<<<------- PAT", soul,key, val, state, 'in', +new Date - S);
          DBG && (DBG.spd = DBG.spd || Number(new Date()))
          __usable_globalThis.debug.STAT &&
						__usable_globalThis.debug.STAT(S, Number(new Date()) - S, 'put')
          // if(!err && count[id] !== lot.s){ console.log(err = "Disk count not same as ram count."); console.STAT && console.STAT(+new Date, lot.s - count[id], 'put ack != count') } delete count[id];
          if (err) {
            root.on('in', {
              '@': id,
              err,
              DBG
            })
            return
          }
          root.on('in', {
            '@': id,
            ok,
            DBG
          })
          // }, id, DBG && (DBG.r = DBG.r || {}));
        },
        false && id,
        DBG && (DBG.r = DBG.r || {})
      )
      DBG && (DBG.sps = DBG.sps || Number(new Date()))
    })
    __usable_globalThis.objectEmpty
    root.on('get', function (msg) {
      this.to.next(msg)
      const ctx = msg._ || ''
      const DBG = (ctx.DBG = msg.DBG)
      DBG && (DBG.sg = Number(new Date()))
      const id = msg['#']
      const get = msg.get
      const soul = msg.get['#']
      const has = msg.get['.'] || ''
      const o = {}
      let graph
      let key
      let tmp
      let force
      if (typeof soul === 'string') {
        key = soul
      } else if (soul) {
        if (undefined !== (tmp = soul['*'])) {
          o.limit = force = 1
        }
        if (undefined !== soul['>']) {
          o.start = soul['>']
        }
        if (undefined !== soul['<']) {
          o.end = soul['<']
        }
        key = force ? `${tmp}` : tmp || soul['=']
        force = null
      }
      if (key && !o.limit) {
        // a soul.has must be on a soul, and not during soul*
        if (typeof has === 'string') {
          key = key + esc + (o.atom = has)
        } else if (has) {
          if (undefined !== has['>']) {
            o.start = has['>']
            o.limit = 1
          }
          if (undefined !== has['<']) {
            o.end = has['<']
            o.limit = 1
          }
          if (undefined !== (tmp = has['*'])) {
            o.limit = force = 1
          }
          if (key) {
            key =
							key +
							esc +
							(force ? `${tmp || ''}` : tmp || (o.atom = has['='] || ''))
          }
        }
      }
      if ((tmp = get['%']) || o.limit) {
        o.limit = tmp <= (o.pack || 1000 * 100) ? tmp : 1
      }
      if (has['-'] || (soul || {})['-'] || get['-']) {
        o.reverse = true
      }
      if ((tmp = (root.next || '')[soul]) && tmp.put) {
        if (o.atom) {
          tmp = (tmp.next || '')[o.atom]
          if (
            tmp &&
						tmp.root &&
						tmp.root.graph &&
						tmp.root.graph[soul] &&
						tmp.root.graph[soul][o.atom]
          ) {
            return
          }
        } else if (tmp && tmp.rad) {
          return
        }
      }
      const now = Gun.state()
      let S = Number(new Date()) // STATS!
      let C = 0
      DBG && (DBG.sgm = S)
      // var GID = String.random(3); console.log("GET ------->>>", GID, key, o, '?', get);
      dare(
        key || '',
        (err, data, info) => {
          // console.log("<<<------- GOT", GID, +new Date - S, err, data);
          DBG && (DBG.sgr = Number(new Date()))
          DBG && (DBG.sgi = info)
          try {
            opt.store.stats.get.time[statg % 50] = Number(new Date()) - S
            ++statg
            opt.store.stats.get.count++
            if (err) {
              opt.store.stats.get.err = err
            }
          } catch (e) {} // STATS!
          // if(u === data && info.chunks > 1){ return } // if we already sent a chunk, ignore ending empty responses. // this causes tests to fail.
          __usable_globalThis.debug.STAT &&
						__usable_globalThis.debug.STAT(
						  S,
						  Number(new Date()) - S,
						  'got',
						  JSON.stringify(key)
						)
          S = Number(new Date())
          info = info || ''
          let va
          let ve
          if (
            info.unit &&
						data &&
						undefined !== (va = data[':']) &&
						undefined !== (ve = data['>'])
          ) {
            // new format
            const tmp = key.split(esc)

            const so = tmp[0]
            const ha = tmp[1];
            (graph = graph || {})[so] = Gun.state.ify(
              graph[so],
              ha,
              ve,
              va,
              so
            )
            root.$.get(so).get(ha)._.rad = now
            // REMEMBER TO ADD _rad TO NODE/SOUL QUERY!
          } else if (data) {
            // old code path
            if (typeof data !== 'string') {
              if (o.atom) {
                data = undefined
              } else {
                Radix.map(data, each, o) // IS A RADIX TREE, NOT FUNCTION!
              }
            }
            if (!graph && data) {
              each(data, '')
            }
            // TODO: !has what about soul lookups?
            if (
              !o.atom &&
							!has & (typeof soul === 'string') &&
							!o.limit &&
							!o.more
            ) {
              root.$.get(soul)._.rad = now
            }
          }
          DBG && (DBG.sgp = Number(new Date()))
          // TODO: PERF NOTES! This is like 0.2s, but for each ack, or all? Can you cache these preps?
          // TODO: PERF NOTES! This is like 0.2s, but for each ack, or all? Can you cache these preps?
          // TODO: PERF NOTES! This is like 0.2s, but for each ack, or all? Can you cache these preps?
          // TODO: PERF NOTES! This is like 0.2s, but for each ack, or all? Can you cache these preps?
          // TODO: PERF NOTES! This is like 0.2s, but for each ack, or all? Can you cache these preps?
          // Or benchmark by reusing first start date.
          if (__usable_globalThis.debug.STAT && (ST = Number(new Date()) - S) > 9) {
            __usable_globalThis.debug.STAT(S, ST, 'got prep time')
            __usable_globalThis.debug.STAT(S, C, 'got prep #')
          }
          C = 0
          S = Number(new Date())
          const faith = () => {}
          faith.faith = true
          faith.rad = get // HNPERF: We're testing performance improvement by skipping going through security again, but this should be audited.
          root.on('in', {
            '@': id,
            put: graph,
            '%': info.more ? 1 : undefined,
            err: err || undefined,
            _: faith,
            DBG
          })
          __usable_globalThis.debug.STAT &&
						(ST = Number(new Date()) - S) > 9 &&
						__usable_globalThis.debug.STAT(
						  S,
						  ST,
						  'got emit',
						  Object.keys(graph || {}).length
						)
          graph = undefined // each is outside our scope, we have to reset graph to nothing!
        },
        o,
        DBG && (DBG.r = DBG.r || {})
      )
      DBG && (DBG.sgd = Number(new Date()))
      __usable_globalThis.debug.STAT &&
				(ST = Number(new Date()) - S) > 9 &&
				__usable_globalThis.debug.STAT(S, ST, 'get call') // TODO: Perf: this was half a second??????
      /**
			 *
			 * @param val
			 * @param has
			 */
      function each (val, has) {
        // TODO: THIS CODE NEEDS TO BE FASTER!!!!
        C++
        if (!val) {
          return
        }
        has = (key + has).split(esc)
        const soul = has.slice(0, 1)[0]
        has = has.slice(-1)[0]
        if (o.limit && o.limit <= o.count) {
          return true
        }
        let va
        let ve
        const so = soul
        const ha = has
        // if(u !== (va = val[':']) && u !== (ve = val['>'])){ // THIS HANDLES NEW CODE!
        if (typeof val !== 'string') {
          // THIS HANDLES NEW CODE!
          va = val[':']
          ve = val['>'];
          (graph = graph || {})[so] = Gun.state.ify(graph[so], ha, ve, va, so)
          // root.$.get(so).get(ha)._.rad = now;
          o.count = (o.count || 0) + ((va || '').length || 9)
          return
        }
        o.count = (o.count || 0) + val.length
        const tmp = val.lastIndexOf('>')
        const state = Radisk.decode(val.slice(tmp + 1), null, esc)
        val = Radisk.decode(val.slice(0, tmp), null, esc);
        (graph = graph || {})[soul] = Gun.state.ify(
          graph[soul],
          has,
          state,
          val,
          soul
        )
      }
    })
    Gun.valid;
    (opt.store || {}).stats = {
      get: {
        time: {},
        count: 0
      },
      put: {
        time: {},
        count: 0
      }
    } // STATS!
    var statg = 0 // STATS!
  })
}

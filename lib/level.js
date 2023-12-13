import gunPlugin from '../gun.js'
let __usable_isActivated = false
const __usable_module = {}

/**
 *
 * @param __usable_environment
 * @param __usable_MODULE
 */
export default async function (__usable_environment) {
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

  // CAUTION: This adapter does NOT handle encoding. an encoding mechanism like the encoding-down package will need to be included
  // Based on localStorage adapter in 05349a5

  const Gun =
		typeof __usable_window !== 'undefined'
		  ? __usable_window.Gun
		  : gunPlugin(__usable_environment)
  let debug = false
  Gun.on('opt', function (ctx) {
    const opt = ctx.opt
    const ev = this.to
    if (debug) debug.emit('create')
    if (ctx.once) return ev.next(ctx)

    // Check if the given 'level' argument implements all the components we need
    // Intentionally doesn't check for levelup explicitly, to allow different handlers implementing the same api
    if (
      !opt.level ||
			typeof opt.level !== 'object' ||
			typeof opt.level.get !== 'function' ||
			typeof opt.level.put !== 'function'
    ) {
      return
    }
    ctx.on('put', function (msg) {
      this.to.next(msg)

      // Extract data from message
      const put = msg.put
      const soul = put['#']
      const key = put['.']
      const val = put[':']
      const state = put['>']
      if (debug) debug.emit('put', soul, val)

      // Fetch previous version
      opt.level.get(soul, (err, data) => {
        if (err && err.name === 'NotFoundError') err = undefined
        if (debug && err) debug.emit('error', err)
        if (err) return

        // Unclear required transformation
        data = Gun.state.ify(data, key, state, val, soul)

        // Write into storage
        opt.level.put(soul, data, (err) => {
          if (err) return
          if (debug) debug.emit('put', soul, val)

          // Bail if message was an ack
          if (msg['@']) return

          // Send ack back
          ctx.on('in', {
            '@': msg['@'],
            ok: 0
          })
        })
      })
    })
    ctx.on('get', function (msg) {
      this.to.next(msg)

      // Extract soul from message
      const lex = msg.get
      if (!lex || !(__usable_globalThis.soul = lex['#'])) return
      const has = lex['.']
      if (debug) debug.emit('get', __usable_globalThis.soul)

      // Fetch data from storage
      opt.level.get(__usable_globalThis.soul, (err, data) => {
        if (err) return

        // Another unclear transformation
        if (data && has) {
          data = Gun.state.to(data, has)
        }

        // Emulate incoming ack
        ctx.on('in', {
          '@': msg['#'],
          put: Gun.graph.node(data)
        })
      })
    })
  })

  // Export debug interface
  if (typeof __usable_window === 'undefined') {
    const EventEmitter = (await import('node:events')).default.EventEmitter
    __usable_module.exports = debug = new EventEmitter()
  }
  __usable_environment.exports.lib.level = __usable_module.exports
  return __usable_module.exports
}

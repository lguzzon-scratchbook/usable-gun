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
		  });
  (() => {
    /*
    	HOW TO USE:
    	1. On your HTML include gun and this file:
    	<script src="gun.js"></script>
    	<script src="lib/wsproto.js"></script>
    	2. Initiate GUN with default WebSocket turned off:
    	var gun = Gun({WebSocket: false});
    */
    let WebSocket
    if (typeof __usable_window !== 'undefined') {
      WebSocket =
				__usable_window.WebSocket ||
				__usable_window.webkitWebSocket ||
				__usable_window.mozWebSocket
    } else {
      return
    }
    __usable_globalThis.Gun.on('opt', function (ctx) {
      this.to.next(ctx)
      const opt = ctx.opt
      if (ctx.once) {
        return
      }
      opt.wsc = opt.wsc || {
        protocols: []
      } // for d3x0r!
      const ws = opt.ws || (opt.ws = {})
      ws.who = 0
      __usable_globalThis.Gun.obj.map(opt.peers, () => {
        ++ws.who
      })
      if (ctx.once) {
        return
      }
      let batch
      ctx.on('out', function (at) {
        this.to.next(at)
        if (at.ws && ws.who == 1) {
          return
        } // performance hack for reducing echoes.
        batch = JSON.stringify(at)
        if (ws.drain) {
          ws.drain.push(batch)
          return
        }
        ws.drain = []
        setTimeout(() => {
          if (!ws.drain) {
            return
          }
          const tmp = ws.drain
          ws.drain = null
          if (!tmp.length) {
            return
          }
          batch = JSON.stringify(tmp)
          __usable_globalThis.Gun.obj.map(opt.peers, send, ctx)
        }, opt.wait || 1)
        __usable_globalThis.Gun.obj.map(opt.peers, send, ctx)
      })
      /**
			 *
			 * @param peer
			 */
      function send (peer) {
        const ctx = this
        const msg = batch
        const wire = peer.wire || open(peer, ctx)
        if (!wire) {
          return
        }
        if (wire.readyState === wire.OPEN) {
          wire.send(msg)
          return
        }
        (peer.queue = peer.queue || []).push(msg)
      }
      /**
			 *
			 * @param msg
			 * @param peer
			 * @param ctx
			 */
      function receive (msg, peer, ctx) {
        if (!ctx || !msg) {
          return
        }
        try {
          msg = JSON.parse(msg.data || msg)
        } catch (e) {}
        if (msg instanceof Array) {
          let i = 0
          let m
          while ((m = msg[i++])) {
            receive(m, peer, ctx)
          }
          return
        }
        if (ws.who == 1) {
          msg.ws = noop
        } // If there is only 1 client, just use noop since it doesn't matter.
        ctx.on('in', msg)
      }
      /**
			 *
			 * @param peer
			 * @param as
			 */
      function open (peer, as) {
        if (!peer || !peer.url) {
          return
        }
        const url = peer.url.replace('http', 'ws')
        const wire = (peer.wire = new WebSocket(
          url,
          as.opt.wsc.protocols,
          as.opt.wsc
        ))
        wire.onclose = () => {
          reconnect(peer, as)
        }
        wire.onerror = (error) => {
          reconnect(peer, as) // placement?
          if (!error) {
            return
          }
          if (error.code === 'ECONNREFUSED') {
            // reconnect(peer, as);
          }
        }
        wire.onopen = () => {
          const queue = peer.queue
          peer.queue = []
          __usable_globalThis.Gun.obj.map(queue, (msg) => {
            batch = msg
            send.call(as, peer)
          })
        }
        wire.onmessage = (msg) => {
          receive(msg, peer, as) // diff: peer not wire!
        }
        return wire
      }
      /**
			 *
			 * @param peer
			 * @param as
			 */
      function reconnect (peer, as) {
        clearTimeout(peer.defer)
        peer.defer = setTimeout(() => {
          open(peer, as)
        }, 2 * 1000)
      }
    })
    var noop = () => {}
  })()
}

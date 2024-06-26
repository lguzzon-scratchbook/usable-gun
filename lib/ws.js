import gunPlugin from '../gun.js'
import wsImport from '../usableLib/wsWrapper.js'
import nodeUrlImport from 'node:url'
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

  const Gun = gunPlugin(__usable_environment)
  const WebSocket = wsImport
  Gun.on('opt', function (ctx) {
    this.to.next(ctx)
    const opt = ctx.opt
    if (!opt.peers) if (typeof (opt == 'string')) opt.peers = [opt]
    if (ctx.once) {
      return
    }
    if (opt.ws === false) {
      return
    }
    const ws = opt.ws || (opt.ws = {})
    let batch
    if (opt.web) {
      ws.server = ws.server || opt.web
      ws.path = ws.path || '/gun'
      if (!ws.web) ws.web = new WebSocket.Server(ws)
      ws.web.on('connection', (wire) => {
        wire.upgradeReq = wire.upgradeReq || {}
        wire.url = nodeUrlImport.parse(wire.upgradeReq.url || '', true)
        wire.id = wire.id || Gun.text.random(6)
        const peer = (opt.peers[wire.id] = {
          wire
        })
        wire.peer = () => peer
        ctx.on('hi', peer)
        wire.on('message', (msg) => {
          // console.log("MESSAGE", msg);
          receive(msg, wire, ctx) // diff: wire is wire.
        })
        wire.on('close', () => {
          ctx.on('bye', peer)
          Gun.obj.del(opt.peers, wire.id)
        })
        wire.on('error', () => {})
      })
    }
    ctx.on('out', function (at) {
      this.to.next(at)
      batch = JSON.stringify(at)
      if (ws.drain) {
        ws.drain.push(batch)
        return
      }
      ws.drain = []
      setTimeout(
        () => {
          if (!ws.drain) {
            return
          }
          const tmp = ws.drain
          ws.drain = null
          if (!tmp.length) {
            return
          }
          batch = JSON.stringify(tmp)
          Gun.obj.map(opt.peers, send, ctx)
        },
        opt.gap || opt.wait || 1
      )
      Gun.obj.map(opt.peers, send, ctx)
    })

    // EVERY message taken care of. The "extra" ones are from in-memory not having "asked" for it yet - which we won't want it to do for foreign requests. Likewise, lots of chattyness because the put/ack replies happen before the `get` syncs so everybody now has it in-memory already to reply with.
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
		 * @param wire
		 * @param ctx
		 */
    function receive (msg, wire, ctx) {
      if (!ctx) {
        return
      }
      try {
        msg = JSON.parse(msg.data || msg)
      } catch (e) {}
      if (msg instanceof Array) {
        let i = 0
        let m
        while ((m = msg[i++])) {
          receive(m, wire, ctx) // wire not peer!
        }
        return
      }
      msg.peer = wire.peer
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
      const wire = (peer.wire = new WebSocket(url))
      wire.on('close', () => {
        reconnect(peer, as)
      })
      wire.on('error', (error) => {
        if (!error) {
          return
        }
        if (error.code === 'ECONNREFUSED') {
          reconnect(peer, as) // placement?
        }
      })
      wire.on('open', () => {
        const queue = peer.queue
        peer.queue = []
        Gun.obj.map(queue, (msg) => {
          batch = msg
          send.call(as, peer)
        })
      })
      wire.on('message', (msg) => {
        receive(msg, wire, as) // diff: wire not peer!
      })
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
}

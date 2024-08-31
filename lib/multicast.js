import mathRandomPlugin from './../usableLib/mathRandomPlugin.js'
import gunPlugin from '../gun.js'
import nodeDgramImport from 'node:dgram'
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
  mathRandomPlugin(__usable_environment)
  const Gun =
		typeof __usable_window !== 'undefined'
		  ? __usable_window.Gun
		  : gunPlugin(__usable_environment)
  Gun.on('create', function (root) {
    this.to.next(root)
    const opt = root.opt
    if (opt.multicast === false) {
      return
    }
    if (
      typeof __usable_process !== 'undefined' &&
			`${(__usable_process.env || {}).MULTICAST}` === 'false'
    ) {
      return
    }
    // if(true !== opt.multicast){ return } // disable multicast by default for now.

    const udp = (opt.multicast = opt.multicast || {})
    udp.address = udp.address || '233.255.255.255'
    udp.pack = udp.pack || 50000 // UDP messages limited to 65KB.
    udp.port = udp.port || 8765
    const noop = () => {}
    const pid = `2${__usable_globalThis.mathRandom().toString().slice(-8)}`
    const mesh = (opt.mesh = opt.mesh || Gun.Mesh(root))
    let dgram
    try {
      dgram = nodeDgramImport
    } catch (e) {
      return
    }
    const socket = dgram.createSocket({
      type: 'udp4',
      reuseAddr: true
    })
    socket.bind(
      {
        port: udp.port,
        exclusive: true
      },
      () => {
        socket.setBroadcast(true)
        socket.setMulticastTTL(128)
      }
    )
    socket.on('listening', () => {
      try {
        socket.addMembership(udp.address)
      } catch (e) {
        __usable_globalThis.debug.error(e)
        return
      }
      udp.peer = {
        id: `${udp.address}:${udp.port}`,
        wire: socket
      }
      udp.peer.say = (raw) => {
        const buf = __usable_globalThis.Buffer.from(raw, 'utf8')
        if (udp.pack <= buf.length) {
          // message too big!!!
          return
        }
        socket.send(buf, 0, buf.length, udp.port, udp.address, noop)
      }
      // opt.mesh.hi(udp.peer);

      Gun.log.once('multi', `Multicast on ${udp.peer.id}`)
      // below code only needed for when WebSocket connections desired!
    })
    socket.on('message', (raw, info) => {
      try {
        if (!raw) {
          return
        }
        raw = raw.toString('utf8')
        if (raw[0] === '2') {
          return check(raw, info)
        }
        opt.mesh.hear(raw, udp.peer)
        // below code only needed for when WebSocket connections desired!
        let message
        // ignore self

        const url =
					`http://${
						info.address
					}:${
						__usable_globalThis.port ||
						((opt.web && opt.web.address()) || {}).port
					}/gun`

        // console.log('discovered', url, message, info);
      } catch (e) {}
    })
    /**
		 *
		 * @param msg
		 */
    function say (msg) {
      this.to.next(msg)
      if (!udp.peer) {
        return
      }
      mesh.say(msg, udp.peer)
    }
    /**
		 *
		 * @param id
		 * @param info
		 */
    function check (id, info) {
      let tmp
      if (!udp.peer) {
        return
      }
      if (!id) {
        id = check.id =
					check.id || __usable_globalThis.Buffer.from(pid, 'utf8')
        socket.send(id, 0, id.length, udp.port, udp.address, noop)
        return
      }
      if ((tmp = root.stats) && (tmp = tmp.gap) && info) {
        (tmp.near || (tmp.near = {}))[info.address] = info.port || 1
      } // STATS!
      if (check.on || id === pid) {
        return
      }
      root.on('out', (check.on = say)) // TODO: MULTICAST NEEDS TO BE CHECKED FOR NEW CODE SYSTEM!!!!!!!!!! // TODO: This approach seems interferes with other relays, below does not but...
      // opt.mesh.hi(udp.peer); //  IS THIS CORRECT?
    }
    setInterval(check, 1000 * 1)
  })
}

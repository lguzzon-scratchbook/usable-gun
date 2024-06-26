import gunPlugin from '../gun.js'
import nodeV8Import from 'node:v8'
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
		      };
  (() => {
    const Gun =
			typeof __usable_window !== 'undefined'
			  ? __usable_window.Gun
			  : gunPlugin(__usable_environment)
    const ev = {}
    const empty = {}
    Gun.on('opt', function (root) {
      this.to.next(root)
      if (root.once) {
        return
      }
      if (typeof __usable_process === 'undefined') {
        return
      }
      const util = __usable_process.memoryUsage
      let heap
      if (!util) {
        return
      }
      try {
        heap = nodeV8Import.getHeapStatistics
      } catch (e) {}
      if (!heap) {
        return
      }
      ev.max =
				parseFloat(
				  root.opt.memory ||
						heap().heap_size_limit / 1024 / 1024 ||
						__usable_process.env.WEB_MEMORY ||
						1399
				) * 0.8 // max_old_space_size defaults to 1400 MB. Note: old space !== memory space though. // KEEPING USED_HEA_SIZE < HEAP_SIZE_LIMIT ONLY THING TO BE BELOW TO PREVENT CRASH!

      setInterval(() => {
        const used = util().rss / 1024 / 1024
        const hused = heap().used_heap_size / 1024 / 1024
        let tmp
        if ((tmp = __usable_globalThis.debug.STAT)) {
          tmp.memax = parseFloat(ev.max.toFixed(1))
          tmp.memused = parseFloat(used.toFixed(1))
          tmp.memhused = parseFloat(hused.toFixed(1))
        }
        if (hused < ev.max && used < ev.max) {
          return
        }
        // if(used < ev.max){ return }
        __usable_globalThis.debug.STAT &&
					__usable_globalThis.debug.STAT(
					  'evict memory:',
					  hused.toFixed(),
					  used.toFixed(),
					  ev.max.toFixed()
					)
        GC() // setTimeout(GC, 1);
      }, 1000)
      /**
			 *
			 */
      function GC () {
        const S = Number(new Date())
        const souls = Object.keys(root.graph || empty)
        let toss = Math.ceil(souls.length * 0.01)
        __usable_globalThis.settimeoutEach(
          souls,
          (soul) => {
            if (--toss < 0) {
              return 1
            }
            root.$.get(soul).off()
          },
          0,
          99
        )
        root.dup.drop(1000 * 9) // clean up message tracker
        __usable_globalThis.debug.STAT &&
					__usable_globalThis.debug.STAT(S, Number(new Date()) - S, 'evict')
      }
      /*
      root.on('in', function(msg){
      	this.to.next(msg);
      	if(msg.get){
      		return;
      	}
      	Gun.graph.is(msg, function(node, soul){
      		var meta = (root.next||empty)[soul];
      		if(!meta){ return }
      		Gun.node.is(node, function(data, key){
      			});
      	});
      });
      */
    })
  })()
}

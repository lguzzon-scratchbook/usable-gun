import gunPlugin from '../gun.js'
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
  /* BEGIN WRAPPED GUN CODE */

  /* Promise Library v1.1 for GUN DB
	 *  Turn any part of a gun chain into a promise, that you can then use
	 *  .then().catch() pattern.
	 *  In normal gun doing var item = gun.get('someKey'), gun returns a reference
	 *  to the someKey synchroneously. Using a reference is quite helpful in making
	 *  graph structures, so I have chosen to follow the following paradigm.
	 *  Whenever a promise is resolved, gun will return an object of data, I will
	 *  wrap that data in an object together with the reference like so:
	 *  {ref: gunRef, data: data}.
	 * This code is freely given in the spirit of open source MIT license.
	 * Author: Jachen Duschletta / 2019
	 */

  // Get window or node Gun instance

  const Gun =
		typeof __usable_window !== 'undefined'
		  ? __usable_window.Gun
		  : gunPlugin(__usable_environment)

  /*
	 * Function promOnce
	 * @param limit - due to promises resolving too fast if we do not set a timer
	 *  we will not be able receive any data back from gun before returning the promise
	 *  works both following a Chain.get and a Chain.map (limit only applies to map)
	 *  If no limit is chosen, defaults to 100 ms (quite sufficient to fetch about 2000 nodes or more)
	 * @param opt - option object
	 * @return {ref: gunReference, data: object / string (data), key: string (soulOfData)}
	 */

  Gun.chain.promOnce = async function (limit, opt) {
    const gun = this
    const cat = gun._
    if (!limit) {
      limit = 100
    }
    if (cat.subs) {
      const array = []
      gun.map().once((data, key) => {
        const gun = this
        array.push(
          new Promise((res) => {
            res({
              ref: gun,
              data,
              key
            })
          })
        )
      }, opt)
      await sleep(limit)
      return Promise.all(array)
    } else {
      return new Promise((res) => {
        gun.once(function (data, key) {
          const gun = this
          res({
            ref: gun,
            data,
            key
          })
        }, opt)
      })
    }
    const chain = gun.chain()
    return chain
  }
  /**
	 *
	 * @param limit
	 */
  function sleep (limit) {
    return new Promise((res) => {
      setTimeout(res, limit)
    })
  }

  /*
	 * Function promPut
	 * @param item (string / object) - item to be put to that key in the chain
	 * @param opt - option object
	 * @return object - Returns an object with the ref to that node that was just
	 *  created as well as the 'ack' which acknowledges the put was succesful
	 *  object {ref: gunReference, ack: acknowledgmentObject}
	 * If put had an error we can catch the return via .catch
	 */

  Gun.chain.promPut = async function (item, opt) {
    const gun = this
    return new Promise((res) => {
      gun.put(
        item,
        (ack) => {
          if (ack.err) {
            __usable_globalThis.debug.log(ack.err)
            ack.ok = -1
            res({
              ref: gun,
              ack
            })
          }
          res({
            ref: gun,
            ack
          })
        },
        opt
      )
    })
  }

  /*
	 * Function promSet
	 * @param item (string / object) - item to be set into a list at this key
	 * @param opt - option object
	 * @return object - Returns object with the ref to that node that was just
	 *  created as well as the 'ack' which acknowledges the set was succesful
	 *  object {ref: gunReference, ack: acknowledgmentObject}
	 * If set had an error we can catch the return via .catch
	 */

  Gun.chain.promSet = async function (item, opt) {
    const gun = this
    let soul
    var cb = cb || (() => {})
    opt = opt || {}
    opt.item = opt.item || item
    return new Promise(async (res, rej) => {
      if ((soul = Gun.node.soul(item))) {
        item = Gun.obj.put({}, soul, Gun.val.link.ify(soul))
      }
      if (!Gun.is(item)) {
        if (Gun.obj.is(item)) {
          item = await gun
            .back(-1)
            .get((soul = soul || Gun.node.soul(item) || gun.back('opt.uuid')()))
            .promPut(item)
          item = item.ref
        }
        res(
          gun.get(soul || Gun.state.lex() + Gun.text.random(7)).promPut(item)
        )
      }
      item.get((soul, o, msg) => {
        if (!soul) {
          rej({
            ack: {
              err: Gun.log(`Only a node can be linked! Not "${msg.put}"!`)
            }
          })
        }
        gun.put(Gun.obj.put({}, soul, Gun.val.link.ify(soul)), cb, opt)
      }, true)
      res({
        ref: item,
        ack: {
          ok: 0
        }
      })
    })
  }

  /*
	 * Function promOn
	 * @param callback (function) - function to be called upon changes to data
	 * @param option (object) - {change: true} only allow changes to trigger the callback
	 * @return - data and key
	 * subscribes callback to data
	 */

  Gun.chain.promOn = async function (callback, option) {
    const gun = this
    return new Promise((res) => {
      gun.on((data, key) => {
        callback(data, key)
        res(data, key)
      }, option)
    })
  }
}

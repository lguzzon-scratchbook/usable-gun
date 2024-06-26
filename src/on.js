import indexPlugin from './index.js'
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

  const Gun = indexPlugin(__usable_environment)
  Gun.chain.on = function (tag, arg, eas, as) {
    // don't rewrite!
    const gun = this

    const cat = gun._
    const root = cat.root
    let act
    if (typeof tag === 'string') {
      if (!arg) {
        return cat.on(tag)
      }
      act = cat.on(tag, arg, eas || cat, as)
      if (eas && eas.$) {
        (eas.subs || (eas.subs = [])).push(act)
      }
      return gun
    }
    let opt = arg;
    (opt =
			opt === true
			  ? {
			      change: true
			    }
			  : opt || {}).not = 1
    opt.on = 1
    // opt.at = cat;
    // opt.ok = tag;
    // opt.last = {};

    // can we assign this to the at instead, like in once?
    gun.get(tag, opt)
    /* gun.get(function on(data,key,msg,eve){ var $ = this;
    	if(tmp = root.hatch){ // quick hack!
    		if(wait[$._.id]){ return } wait[$._.id] = 1;
    		tmp.push(function(){on.call($, data,key,msg,eve)});
    		return;
    	}; wait = {}; // end quick hack.
    	tag.call($, data,key,msg,eve);
    }, opt); // TODO: PERF! Event listener leak!!!? */
    /*
    function one(msg, eve){
    	if(one.stun){ return }
    	var at = msg.$._, data = at.put, tmp;
    	if(tmp = at.link){ data = root.$.get(tmp)._.put }
    	if(opt.not===u && u === data){ return }
    	if(opt.stun===u && (tmp = root.stun) && (tmp = tmp[at.id] || tmp[at.back.id]) && !tmp.end){ // Remember! If you port this into `.get(cb` make sure you allow stun:0 skip option for `.put(`.
    		tmp[id] = function(){one(msg,eve)};
    		return;
    	}
    	//tmp = one.wait || (one.wait = {}); console.log(tmp[at.id] === ''); if(tmp[at.id] !== ''){ tmp[at.id] = tmp[at.id] || setTimeout(function(){tmp[at.id]='';one(msg,eve)},1); return } delete tmp[at.id];
    	// call:
    	if(opt.as){
    		opt.ok.call(opt.as, msg, eve || one);
    	} else {
    		opt.ok.call(at.$, data, msg.get || at.get, msg, eve || one);
    	}
    };
    one.at = cat;
    (cat.act||(cat.act={}))[id = String.random(7)] = one;
    one.off = function(){ one.stun = 1; if(!cat.act){ return } delete cat.act[id] }
    cat.on('out', {get: {}}); */
    return gun
  }
  // Rules:
  // 1. If cached, should be fast, but not read while write.
  // 2. Should not retrigger other listeners, should get triggered even if nothing found.
  // 3. If the same callback passed to many different once chains, each should resolve - an unsubscribe from the same callback should not effect the state of the other resolving chains, if you do want to cancel them all early you should mutate the callback itself with a flag & check for it at top of callback
  Gun.chain.once = function (cb, opt) {
    opt = opt || {} // avoid rewriting
    if (!cb) {
      return none(this, opt)
    }
    const gun = this
    const cat = gun._
    const root = cat.root
    const data = cat.put
    const id = __usable_globalThis.stringRandom(7)
    let tmp
    gun.get(
      function (data, key, msg, eve) {
        const $ = this
        let at = $._
        const one = at.one || (at.one = {})
        if (eve.stun) {
          return
        }
        if (one[id] === '') {
          return
        }
        if ((tmp = Gun.valid(data)) === true) {
          once()
          return
        }
        if (typeof tmp === 'string') {
          return
        } // TODO: BUG? Will this always load?
        clearTimeout((cat.one || '')[id]) // clear "not found" since they only get set on cat.
        clearTimeout(one[id])
        one[id] = setTimeout(once, opt.wait || 99) // TODO: Bug? This doesn't handle plural chains.
        /**
				 *
				 * @param f
				 */
        function once (f) {
          if (!at.has && !at.soul) {
            at = {
              put: data,
              get: key
            }
          } // handles non-core messages.
          if (undefined === (tmp = at.put)) {
            tmp = ((msg.$ || '')._ || '').put
          }
          if (typeof Gun.valid(tmp) === 'string') {
            tmp = root.$.get(tmp)._.put
            if (tmp === undefined && !f) {
              one[id] = setTimeout(() => {
                once(1)
              }, opt.wait || 99) // TODO: Quick fix. Maybe use ack count for more predictable control?
              return
            }
          }
          // console.log("AND VANISHED", data);
          if (eve.stun) {
            return
          }
          if (one[id] === '') {
            return
          }
          one[id] = ''
          if (cat.soul || cat.has) {
            eve.off()
          } // TODO: Plural chains? // else { ?.off() } // better than one check?
          cb.call($, tmp, at.get)
          clearTimeout(one[id]) // clear "not found" since they only get set on cat. // TODO: This was hackily added, is it necessary or important? Probably not, in future try removing this. Was added just as a safety for the `&& !f` check.
        }
      },
      {
        on: 1
      }
    )
    return gun
  }
  /**
	 *
	 * @param gun
	 * @param opt
	 * @param chain
	 */
  function none (gun, opt, chain) {
    Gun.log.once(
      'valonce',
      'Chainable val is experimental, its behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it.'
    );
    (chain = gun.chain())._.nix = gun.once(function () {
      chain._.on('in', this._)
    })
    chain._.lex = gun._.lex // TODO: Better approach in future? This is quick for now.
    return chain
  }
  Gun.chain.off = function () {
    // make off more aggressive. Warning, it might backfire!
    const gun = this

    const at = gun._
    let tmp
    const cat = at.back
    if (!cat) {
      return
    }
    at.ack = 0 // so can resubscribe.
    if ((tmp = cat.next)) {
      if (tmp[at.get]) {
        delete tmp[at.get]
      }
    }
    // TODO: delete cat.one[map.id]?
    if ((tmp = cat.any)) {
      delete cat.any
      cat.any = {}
    }
    if ((tmp = cat.ask)) {
      delete tmp[at.get]
    }
    if ((tmp = cat.put)) {
      delete tmp[at.get]
    }
    if ((tmp = at.soul)) {
      delete cat.root.graph[tmp]
    }
    if ((tmp = at.map)) {
      Object.keys(tmp).forEach((i, at) => {
        at = tmp[i] // obj_map(tmp, function(at){
        if (at.link) {
          cat.root.$.get(at.link).off()
        }
      })
    }
    if ((tmp = at.next)) {
      Object.keys(tmp).forEach((i, neat) => {
        neat = tmp[i] // obj_map(tmp, function(neat){
        neat.$.off()
      })
    }
    at.on('off', {})
    return gun
  }
}

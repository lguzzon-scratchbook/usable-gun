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

  // WARNING: GUN is very simple, but the JavaScript chaining API around GUN
  // is complicated and was extremely hard to build. If you port GUN to another
  // language, consider implementing an easier API to build.
  const Gun = rootPlugin(__usable_environment)
  Gun.chain.chain = function (sub) {
    const gun = this
    const at = gun._
    const chain = new (sub || gun).constructor(gun)
    const cat = chain._
    let root
    cat.root = root = at.root
    cat.id = ++root.once
    cat.back = gun._
    cat.on = Gun.on
    cat.on('in', Gun.on.in, cat) // For 'in' if I add my own listeners to each then I MUST do it before in gets called. If I listen globally for all incoming data instead though, regardless of individual listeners, I can transform the data there and then as well.
    cat.on('out', Gun.on.out, cat) // However for output, there isn't really the global option. I must listen by adding my own listener individually BEFORE this one is ever called.
    return chain
  }
  /**
	 *
	 * @param msg
	 */
  function output (msg) {
    let get
    const at = this.as
    let back = at.back
    const root = at.root
    let tmp
    if (!msg.$) {
      msg.$ = at.$
    }
    this.to.next(msg)
    if (at.err) {
      at.on('in', {
        put: (at.put = undefined),
        $: at.$
      })
      return
    }
    if ((get = msg.get)) {
      /* if(u !== at.put){
      	at.on('in', at);
      	return;
      } */
      if (root.pass) {
        root.pass[at.id] = at
      } // will this make for buggy behavior elsewhere?
      if (at.lex) {
        Object.keys(at.lex).forEach(
          (k) => {
            tmp[k] = at.lex[k]
          },
          (tmp = msg.get = msg.get || {})
        )
      }
      if (get['#'] || at.soul) {
        get['#'] = get['#'] || at.soul
        // root.graph[get['#']] = root.graph[get['#']] || {_:{'#':get['#'],'>':{}}};
        msg['#'] || (msg['#'] = text_rand(9)) // A3120 ?
        back = root.$.get(get['#'])._
        if (!(get = get['.'])) {
          // soul
          tmp = back.ask && back.ask['']; // check if we have already asked for the full node
          (back.ask || (back.ask = {}))[''] = back // add a flag that we are now.
          if (undefined !== back.put) {
            // if we already have data,
            back.on('in', back) // send what is cached down the chain
            if (tmp) {
              return
            } // and don't ask for it again.
          }
          msg.$ = back.$
        } else if (obj_has(back.put, get)) {
          // TODO: support #LEX !
          tmp = back.ask && back.ask[get];
          (back.ask || (back.ask = {}))[get] = back.$.get(get)._
          back.on('in', {
            get,
            put: {
              '#': back.soul,
              '.': get,
              ':': back.put[get],
              '>': state_is(root.graph[back.soul], get)
            }
          })
          if (tmp) {
            return
          }
        }
        /* put = (back.$.get(get)._);
        if(!(tmp = put.ack)){ put.ack = -1 }
        back.on('in', {
        	$: back.$,
        	put: Gun.state.ify({}, get, Gun.state(back.put, get), back.put[get]),
        	get: back.get
        });
        if(tmp){ return }
        } else
        if('string' != typeof get){
        var put = {}, meta = (back.put||{})._;
        Gun.obj.map(back.put, function(v,k){
        	if(!Gun.text.match(k, get)){ return }
        	put[k] = v;
        })
        if(!Gun.obj.empty(put)){
        	put._ = meta;
        	back.on('in', {$: back.$, put: put, get: back.get})
        }
        if(tmp = at.lex){
        	tmp = (tmp._) || (tmp._ = function(){});
        	if(back.ack < tmp.ask){ tmp.ask = back.ack }
        	if(tmp.ask){ return }
        	tmp.ask = 1;
        }
        }
        */
        root.ask(ack, msg) // A3120 ?
        return root.on('in', msg)
      }
      // if(root.now){ root.now[at.id] = root.now[at.id] || true; at.pass = {} }
      if (get['.']) {
        if (at.get) {
          msg = {
            get: {
              '.': at.get
            },
            $: at.$
          };
          (back.ask || (back.ask = {}))[at.get] = msg.$._ // TODO: PERFORMANCE? More elegant way?
          return back.on('out', msg)
        }
        msg = {
          get: at.lex ? msg.get : {},
          $: at.$
        }
        return back.on('out', msg)
      }
      (at.ask || (at.ask = {}))[''] = at // at.ack = at.ack || -1;
      if (at.get) {
        get['.'] = at.get;
        (back.ask || (back.ask = {}))[at.get] = msg.$._ // TODO: PERFORMANCE? More elegant way?
        return back.on('out', msg)
      }
    }
    return back.on('out', msg)
  }
  Gun.on.out = output
  /**
	 *
	 * @param msg
	 * @param cat
	 */
  function input (msg, cat) {
    cat = cat || this.as // TODO: V8 may not be able to optimize functions with different parameter calls, so try to do benchmark to see if there is any actual difference.
    const root = cat.root // eve = event, at = data at, cat = chain at, sat = sub at (children chains).
    let gun = msg.$ || (msg.$ = cat.$)
    const at = (gun || '')._ || empty
    let tmp = msg.put || ''
    let soul = tmp['#']
    let key = tmp['.']
    const change = undefined !== tmp['='] ? tmp['='] : tmp[':']
    let state = tmp['>'] || -Infinity
    let sat
    if (
      undefined !== msg.put &&
			(undefined === tmp['#'] ||
				undefined === tmp['.'] ||
				(undefined === tmp[':'] && undefined === tmp['=']) ||
				undefined === tmp['>'])
    ) {
      // convert from old format
      if (!valid(tmp)) {
        if (!(soul = ((tmp || '')._ || '')['#'])) {
          __usable_globalThis.debug.log(
            'chain not yet supported for',
            tmp,
            '...',
            msg,
            cat
          )
          return
        }
        gun = cat.root.$.get(soul)
        return __usable_globalThis.settimeoutEach(
          Object.keys(tmp).sort(),
          (k) => {
            // TODO: .keys( is slow // BUG? ?Some re-in logic may depend on this being sync?
            if (k == '_' || undefined === (state = state_is(tmp, k))) {
              return
            }
            cat.on('in', {
              $: gun,
              put: {
                '#': soul,
                '.': k,
                '=': tmp[k],
                '>': state
              },
              VIA: msg
            })
          }
        )
      }
      cat.on('in', {
        $: at.back.$,
        put: {
          '#': (soul = at.back.soul),
          '.': (key = at.has || at.get),
          '=': tmp,
          '>': state_is(at.back.put, key)
        },
        via: msg
      }) // TODO: This could be buggy! It assumes/approxes data, other stuff could have corrupted it.
      return
    }
    if ((msg.seen || '')[cat.id]) {
      return
    }
    (msg.seen || (msg.seen = () => {}))[cat.id] = cat // help stop some infinite loops

    if (cat !== at) {
      // don't worry about this when first understanding the code, it handles changing contexts on a message. A soul chain will never have a different context.
      Object.keys(msg).forEach(
        (k) => {
          tmp[k] = msg[k]
        },
        (tmp = {})
      ) // make copy of message
      tmp.get = cat.get || tmp.get
      if (!cat.soul && !cat.has) {
        // if we do not recognize the chain type
        tmp.$$ = tmp.$$ || cat.$ // make a reference to wherever it came from.
      } else if (at.soul) {
        // a has (property) chain will have a different context sometimes if it is linked (to a soul chain). Anything that is not a soul or has chain, will always have different contexts.
        tmp.$ = cat.$
        tmp.$ = tmp.$ || at.$
      }
      msg = tmp // use the message with the new context instead;
    }
    unlink(msg, cat)
    if (
      (cat.soul /* && (cat.ask||'')[''] */ || msg.$) &&
			state >= state_is(root.graph[soul], key)
    ) {
      // The root has an in-memory cache of the graph, but if our peer has asked for the data then we want a per deduplicated chain copy of the data that might have local edits on it.
      (tmp = root.$.get(soul)._).put = state_ify(
        tmp.put,
        key,
        state,
        change,
        soul
      )
    }
    if (
      !at.soul /* && (at.ask||'')[''] */ &&
			state >= state_is(root.graph[soul], key) &&
			(sat = (root.$.get(soul)._.next || '')[key])
    ) {
      // Same as above here, but for other types of chains. // TODO: Improve perf by preventing echoes recaching.
      sat.put = change // update cache
      if (typeof (tmp = valid(change)) === 'string') {
        sat.put = root.$.get(tmp)._.put || change // share same cache as what we're linked to.
      }
    }
    this.to && this.to.next(msg) // 1st API job is to call all chain listeners.
    // TODO: Make input more reusable by only doing these (some?) calls if we are a chain we recognize? This means each input listener would be responsible for when listeners need to be called, which makes sense, as they might want to filter.
    cat.any &&
			__usable_globalThis.settimeoutEach(
			  Object.keys(cat.any),
			  (any) => {
			    (any = cat.any[any]) && any(msg)
			  },
			  0,
			  99
			) // 1st API job is to call all chain listeners. // TODO: .keys( is slow // BUG: Some re-in logic may depend on this being sync.
    cat.echo &&
			__usable_globalThis.settimeoutEach(
			  Object.keys(cat.echo),
			  (lat) => {
			    (lat = cat.echo[lat]) && lat.on('in', msg)
			  },
			  0,
			  99
			) // & linked at chains // TODO: .keys( is slow // BUG: Some re-in logic may depend on this being sync.

    if (((msg.$ || '')._ || at).soul) {
      // comments are linear, but this line of code is non-linear, so if I were to comment what it does, you'd have to read 42 other comments first... but you can't read any of those comments until you first read this comment. What!? // shouldn't this match link's check?
      // is there cases where it is a $ that we do NOT want to do the following?
      if ((sat = cat.next) && (sat = sat[key])) {
        // TODO: possible trick? Maybe have `ionmap` code set a sat? // TODO: Maybe we should do `cat.ask` instead? I guess does not matter.
        tmp = {}
        Object.keys(msg).forEach((k) => {
          tmp[k] = msg[k]
        })
        tmp.$ = (msg.$ || msg.$).get((tmp.get = key))
        delete tmp.$
        delete tmp.$$
        sat.on('in', tmp)
      }
    }
    link(msg, cat)
  }
  Gun.on.in = input
  /**
	 *
	 * @param msg
	 * @param cat
	 */
  function link (msg, cat) {
    cat = cat || this.as || msg.$._
    if (msg.$ && this !== Gun.on) {
      return
    } // $ means we came from a link, so we are at the wrong level, thus ignore it unless overruled manually by being called directly.
    if (!msg.put || cat.soul) {
      return
    } // But you cannot overrule being linked to nothing, or trying to link a soul chain - that must never happen.
    const put = msg.put || ''
    let link = put['='] || put[':']
    var tmp
    const root = cat.root
    const tat = root.$.get(put['#']).get(put['.'])._
    if (typeof (link = valid(link)) !== 'string') {
      if (this === Gun.on) {
        (tat.echo || (tat.echo = {}))[cat.id] = cat
      } // allow some chain to explicitly force linking to simple data.
      return // by default do not link to data that is not a link.
    }
    if (
      (tat.echo || (tat.echo = {}))[cat.id] && // we've already linked ourselves so we do not need to do it again. Except... (annoying implementation details)
			!(root.pass || '')[cat.id]
    ) {
      return
    } // if a new event listener was added, we need to make a pass through for it. The pass will be on the chain, not always the chain passed down.
    if ((tmp = root.pass)) {
      if (tmp[link + cat.id]) {
        return
      }
      tmp[link + cat.id] = 1
    } // But the above edge case may "pass through" on a circular graph causing infinite passes, so we hackily add a temporary check for that.

    (tat.echo || (tat.echo = {}))[cat.id] = cat // set ourself up for the echo! // TODO: BUG? Echo to self no longer causes problems? Confirm.

    if (cat.has) {
      cat.link = link
    }
    const sat = root.$.get((tat.link = link))._; // grab what we're linking to.
    (sat.echo || (sat.echo = {}))[tat.id] = tat // link it.
    var tmp = cat.ask || '' // ask the chain for what needs to be loaded next!
    if (tmp[''] || cat.lex) {
      // we might need to load the whole thing // TODO: cat.lex probably has edge case bugs to it, need more test coverage.
      sat.on('out', {
        get: {
          '#': link
        }
      })
    }
    __usable_globalThis.settimeoutEach(
      Object.keys(tmp),
      (get, sat) => {
        // if sub chains are asking for data. // TODO: .keys( is slow // BUG? ?Some re-in logic may depend on this being sync?
        if (!get || !(sat = tmp[get])) {
          return
        }
        sat.on('out', {
          get: {
            '#': link,
            '.': get
          }
        }) // go get it.
      },
      0,
      99
    )
  }
  Gun.on.link = link
  /**
	 *
	 * @param msg
	 * @param cat
	 */
  function unlink (msg, cat) {
    // ugh, so much code for seemingly edge case behavior.
    const put = msg.put || ''

    const change = undefined !== put['='] ? put['='] : put[':']
    const root = cat.root
    let link
    let tmp
    if (undefined === change) {
      // 1st edge case: If we have a brand new database, no data will be found.
      // TODO: BUG! because emptying cache could be async from below, make sure we are not emptying a newer cache. So maybe pass an Async ID to check against?
      // TODO: BUG! What if this is a map? // Warning! Clearing things out needs to be robust against sync/async ops, or else you'll see `map val get put` test catastrophically fail because map attempts to link when parent graph is streamed before child value gets set. Need to differentiate between lack acks and force clearing.
      if (cat.soul && undefined !== cat.put) {
        return
      } // data may not be found on a soul, but if a soul already has data, then nothing can clear the soul as a whole.
      // if(!cat.has){ return }
      tmp = (msg.$ || msg.$ || '')._ || ''
      if (msg['@'] && (undefined !== tmp.put || undefined !== cat.put)) {
        return
      } // a "not found" from other peers should not clear out data if we have already found it.
      // if(cat.has && u === cat.put && !(root.pass||'')[cat.id]){ return } // if we are already unlinked, do not call again, unless edge case. // TODO: BUG! This line should be deleted for "unlink deeply nested".
      if ((link = cat.link || msg.linked)) {
        delete (root.$.get(link)._.echo || '')[cat.id]
      }
      if (cat.has) {
        // TODO: Empty out links, maps, echos, acks/asks, etc.?
        cat.link = null
      }
      cat.put = undefined // empty out the cache if, for example, alice's car's color no longer exists (relative to alice) if alice no longer has a car.
      // TODO: BUG! For maps, proxy this so the individual sub is triggered, not all subs.
      __usable_globalThis.settimeoutEach(
        Object.keys(cat.next || ''),
        (get, sat) => {
          // empty out all sub chains. // TODO: .keys( is slow // BUG? ?Some re-in logic may depend on this being sync? // TODO: BUG? This will trigger deeper put first, does put logic depend on nested order? // TODO: BUG! For map, this needs to be the isolated child, not all of them.
          if (!(sat = cat.next[get])) {
            return
          }
          // if(cat.has && u === sat.put && !(root.pass||'')[sat.id]){ return } // if we are already unlinked, do not call again, unless edge case. // TODO: BUG! This line should be deleted for "unlink deeply nested".
          if (link) {
            delete (root.$.get(link).get(get)._.echo || '')[sat.id]
          }
          sat.on('in', {
            get,
            put: undefined,
            $: sat.$
          }) // TODO: BUG? Add recursive seen check?
        },
        0,
        99
      )
      return
    }
    if (cat.soul) {
      return
    } // a soul cannot unlink itself.
    if (msg.$) {
      return
    } // a linked chain does not do the unlinking, the sub chain does. // TODO: BUG? Will this cancel maps?
    link = valid(change) // need to unlink anytime we are not the same link, though only do this once per unlink (and not on init).
    tmp = msg.$._ || ''
    if (link === tmp.link || (cat.has && !tmp.link)) {
      if (!((root.pass || '')[cat.id] && typeof link !== 'string')) {
        return
      }
    }
    delete (tmp.echo || '')[cat.id]
    unlink(
      {
        get: cat.get,
        put: undefined,
        $: msg.$,
        linked: (msg.linked = msg.linked || tmp.link)
      },
      cat
    ) // unlink our sub chains.
  }
  Gun.on.unlink = unlink
  /**
	 *
	 * @param msg
	 */
  function ack (msg) {
    // if(!msg['%'] && (this||'').off){ this.off() } // do NOT memory leak, turn off listeners! Now handled by .ask itself
    // manhattan:
    const as = this.as

    const at = as.$._
    const root = at.root
    const get = as.get || ''
    const tmp = (msg.put || '')[get['#']] || ''
    if (
      !msg.put ||
			(typeof get['.'] === 'string' && undefined === tmp[get['.']])
    ) {
      if (undefined !== at.put) {
        return
      }
      if (!at.soul && !at.has) {
        return
      } // TODO: BUG? For now, only core-chains will handle not-founds, because bugs creep in if non-core chains are used as $ but we can revisit this later for more powerful extensions.
      at.ack = (at.ack || 0) + 1
      at.on('in', {
        get: at.get,
        put: (at.put = undefined),
        $: at.$,
        '@': msg['@']
      })
      /* (tmp = at.Q) && setTimeout.each(Object.keys(tmp), function(id){ // TODO: Temporary testing, not integrated or being used, probably delete.
      	Object.keys(msg).forEach(function(k){ tmp[k] = msg[k] }, tmp = {}); tmp['@'] = id; // copy message
      	root.on('in', tmp);
      }); delete at.Q; */
      return
    }
    (msg._ || {}).miss = 1
    Gun.on.put(msg)
    // eom
  }
  var empty = {}
  var text_rand = __usable_globalThis.stringRandom
  var valid = Gun.valid
  var obj_has = (o, k) => o && Object.prototype.hasOwnProperty.call(o, k)
  const state = Gun.state
  var state_is = state.is
  var state_ify = state.ify
}

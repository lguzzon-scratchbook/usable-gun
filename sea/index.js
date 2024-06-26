import seaPlugin from './sea.js'
import settingsPlugin from './settings.js'
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

  /* BEGIN WRAPPED GUN CODE */

  const SEA = seaPlugin(__usable_environment)

  const S = settingsPlugin(__usable_environment)
  const Gun = (SEA.window || '').GUN || gunPlugin(__usable_environment)
  // After we have a GUN extension to make user registration/login easy, we then need to handle everything else.

  // We do this with a GUN adapter, we first listen to when a gun instance is created (and when its options change)
  Gun.on('opt', function (at) {
    if (!at.sea) {
      // only add SEA once per instance, on the "at" context.
      at.sea = {
        own: {}
      }
      at.on('put', check, at) // SEA now runs its firewall on HAM diffs, not all i/o.
    }
    this.to.next(at) // make sure to call the "next" middleware adapter.
  })

  // Alright, this next adapter gets run at the per node level in the graph database.
  // correction: 2020 it gets run on each key/value pair in a node upon a HAM diff.
  // This will let us verify that every property on a node has a value signed by a public key we trust.
  // If the signature does not match, the data is just `undefined` so it doesn't get passed on.
  // If it does match, then we transform the in-memory "view" of the data into its plain value (without the signature).
  // Now NOTE! Some data is "system" data, not user data. Example: List of public keys, aliases, etc.
  // This data is self-enforced (the value can only match its ID), but that is handled in the `security` function.
  // From the self-enforced data, we can see all the edges in the graph that belong to a public key.
  // Example: ~ASDF is the ID of a node with ASDF as its public key, signed alias and salt, and
  // its encrypted private key, but it might also have other signed values on it like `profile = <ID>` edge.
  // Using that directed edge's ID, we can then track (in memory) which IDs belong to which keys.
  // Here is a problem: Multiple public keys can "claim" any node's ID, so this is dangerous!
  // This means we should ONLY trust our "friends" (our key ring) public keys, not any ones.
  // I have not yet added that to SEA yet in this alpha release. That is coming soon, but beware in the meanwhile!

  /**
	 *
	 * @param msg
	 */
  function check (msg) {
    // REVISE / IMPROVE, NO NEED TO PASS MSG/EVE EACH SUB?
    const eve = this

    const at = eve.as
    const put = msg.put
    const soul = put['#']
    const key = put['.']
    const val = put[':']
    const state = put['>']
    const id = msg['#']
    let tmp
    if (!soul || !key) {
      return
    }
    if (
      (msg._ || '').faith &&
			(at.opt || '').faith &&
			typeof msg._ === 'function'
    ) {
      SEA.opt.pack(put, (raw) => {
        SEA.verify(raw, false, (data) => {
          // this is synchronous if false
          put['='] = SEA.opt.unpack(data)
          eve.to.next(msg)
        })
      })
      return
    }
    const no = (why) => {
      at.on('in', {
        '@': id,
        err: (msg.err = why)
      })
    }; // exploit internal relay stun for now, maybe violates spec, but testing for now. // Note: this may be only the sharded message, not original batch.
    // var no = function(why){ msg.ack(why) };
    (msg._ || '').DBG && ((msg._ || '').DBG.c = Number(new Date()))
    if (soul.indexOf('<?') >= 0) {
      // special case for "do not sync data X old" forget
      // 'a~pub.key/b<?9'
      tmp = parseFloat(soul.split('<?')[1] || '')
      if (tmp && state < Gun.state() - tmp * 1000) {
        // sec to ms
        (tmp = msg._) && tmp.stun && tmp.stun-- // THIS IS BAD CODE! It assumes GUN internals do something that will probably change in future, but hacking in now.
        return // omit!
      }
    }
    if (soul === '~@') {
      // special case for shared system data, the list of aliases.
      check.alias(eve, msg, val, key, soul, at, no)
      return
    }
    if (soul.slice(0, 2) === '~@') {
      // special case for shared system data, the list of public keys for an alias.
      check.pubs(eve, msg, val, key, soul, at, no)
      return
    }
    // if('~' === soul.slice(0,1) && 2 === (tmp = soul.slice(1)).split('.').length){ // special case, account data for a public key.
    if ((tmp = SEA.opt.pub(soul))) {
      // special case, account data for a public key.
      check.pub(eve, msg, val, key, soul, at, no, at.user || '', tmp)
      return
    }
    if (soul.indexOf('#') >= 0) {
      // special case for content addressing immutable hashed data.
      check.hash(eve, msg, val, key, soul, at, no)
      return
    }
    check.any(eve, msg, val, key, soul, at, no, at.user || '')

    // not handled
  }
  check.hash = (eve, msg, val, key, soul, at, no) => {
    // mark unbuilt @i001962 's epic hex contrib!
    SEA.work(
      val,
      null,
      (data) => {
        if (data && data === key.split('#').slice(-1)[0]) {
          return eve.to.next(msg)
        } else if (
          data &&
					data ===
						((hexStr) => {
						  let base64 = ''
						  for (let i = 0; i < hexStr.length; i++) {
						    base64 += !((i - 1) & 1)
						      ? String.fromCharCode(
						        parseInt(hexStr.substring(i - 1, i + 1), 16)
						      )
						      : ''
						  }
						  return btoa(base64)
						})(key.split('#').slice(-1)[0])
        ) {
          return eve.to.next(msg)
        }
        no('Data hash not same as hash!')
      },
      {
        name: 'SHA-256'
      }
    )
  }
  check.alias = (eve, msg, val, key, soul, at, no) => {
    // Example: {_:#~@, ~@alice: {#~@alice}}
    if (!val) {
      return no('Data must exist!')
    } // data MUST exist
    if (`~@${key}` === link_is(val)) {
      return eve.to.next(msg)
    } // in fact, it must be EXACTLY equal to itself
    no('Alias not same!') // if it isn't, reject.
  }
  check.pubs = (eve, msg, val, key, soul, at, no) => {
    // Example: {_:#~@alice, ~asdf: {#~asdf}}
    if (!val) {
      return no('Alias must exist!')
    } // data MUST exist
    if (key === link_is(val)) {
      return eve.to.next(msg)
    } // and the ID must be EXACTLY equal to its property
    no('Alias not same!') // that way nobody can tamper with the list of public keys.
  }
  check.pub = async (eve, msg, val, key, soul, at, no, user, pub) => {
    let tmp // Example: {_:#~asdf, hello:'world'~fdsa}}
    const raw = (await S.parse(val)) || {}
    const verify = (certificate, certificant, cb) => {
      if (certificate.m && certificate.s && certificant && pub)
      // now verify certificate
      {
        return SEA.verify(certificate, pub, (data) => {
          // check if "pub" (of the graph owner) really issued this cert
          if (
            undefined !== data &&
						undefined !== data.e &&
						msg.put['>'] &&
						msg.put['>'] > parseFloat(data.e)
          ) { return no('Certificate expired.') } // certificate expired
          // "data.c" = a list of certificants/certified users
          // "data.w" = lex WRITE permission, in the future, there will be "data.r" which means lex READ permission
          if (
            undefined !== data &&
						data.c &&
						data.w &&
						(data.c === certificant || data.c.indexOf('*' || certificant) > -1)
          ) {
            // ok, now "certificant" is in the "certificants" list, but is "path" allowed? Check path
            const path =
							soul.indexOf('/') > -1
							  ? soul.replace(soul.substring(0, soul.indexOf('/') + 1), '')
							  : ''
            __usable_globalThis.stringMatch =
							__usable_globalThis.stringMatch || Gun.text.match
            const w = Array.isArray(data.w)
              ? data.w
              : typeof data.w === 'object' || typeof data.w === 'string'
                ? [data.w]
                : []
            for (const lex of w) {
              if (
                (__usable_globalThis.stringMatch(path, lex['#']) &&
									__usable_globalThis.stringMatch(key, lex['.'])) ||
								(!lex['.'] &&
									__usable_globalThis.stringMatch(path, lex['#'])) ||
								(!lex['#'] && __usable_globalThis.stringMatch(key, lex['.'])) ||
								__usable_globalThis.stringMatch(
								  path ? `${path}/${key}` : key,
								  lex['#'] || lex
								)
              ) {
                // is Certificant forced to present in Path
                if (
                  lex['+'] &&
									lex['+'].indexOf('*') > -1 &&
									path &&
									path.indexOf(certificant) == -1 &&
									key.indexOf(certificant) == -1
                ) {
                  return no(
										`Path "${path}" or key "${key}" must contain string "${certificant}".`
                  )
                }
                // path is allowed, but is there any WRITE block? Check it out
                if (
                  data.wb &&
									(typeof data.wb === 'string' || (data.wb || {})['#'])
                ) {
                  // "data.wb" = path to the WRITE block
                  let root = eve.as.root.$.back(-1)
                  if (
                    typeof data.wb === 'string' &&
										data.wb.slice(0, 1) !== '~'
                  ) { root = root.get(`~${pub}`) }
                  return root
                    .get(data.wb)
                    .get(certificant)
                    .once((value) => {
                      // TODO: INTENT TO DEPRECATE.
                      if (value && (value === 1 || value === true)) { return no(`Certificant ${certificant} blocked.`) }
                      return cb(data)
                    })
                }
                return cb(data)
              }
            }
            return no('Certificate verification fail.')
          }
        })
      }
    }
    if (key === 'pub' && `~${pub}` === soul) {
      if (val === pub) return eve.to.next(msg) // the account MUST match `pub` property that equals the ID of the public key.
      return no('Account not same!')
    }
    if (
      (tmp = user.is) &&
			tmp.pub &&
			!raw['*'] &&
			!raw['+'] &&
			(pub === tmp.pub ||
				(pub !== tmp.pub && ((msg._.msg || {}).opt || {}).cert))
    ) {
      SEA.opt.pack(msg.put, (packed) => {
        SEA.sign(
          packed,
          user._.sea,
          async (data) => {
            if (undefined === data) return no(SEA.err || 'Signature fail.')
            msg.put[':'] = {
              ':': (tmp = SEA.opt.unpack(data.m)),
              '~': data.s
            }
            msg.put['='] = tmp

            // if writing to own graph, just allow it
            if (pub === user.is.pub) {
              if ((tmp = link_is(val))) { (at.sea.own[tmp] = at.sea.own[tmp] || {})[pub] = 1 }
              __usable_globalThis.jsonStringifyAsync(msg.put[':'], (err, s) => {
                if (err) {
                  return no(err || 'Stringify error.')
                }
                msg.put[':'] = s
                return eve.to.next(msg)
              })
              return
            }

            // if writing to other's graph, check if cert exists then try to inject cert into put, also inject self pub so that everyone can verify the put
            if (pub !== user.is.pub && ((msg._.msg || {}).opt || {}).cert) {
              const cert = await S.parse(msg._.msg.opt.cert)
              // even if cert exists, we must verify it
              if (cert && cert.m && cert.s) {
                verify(cert, user.is.pub, () => {
                  msg.put[':']['+'] = cert // '+' is a certificate
                  msg.put[':']['*'] = user.is.pub // '*' is pub of the user who puts
                  __usable_globalThis.jsonStringifyAsync(
                    msg.put[':'],
                    (err, s) => {
                      if (err) {
                        return no(err || 'Stringify error.')
                      }
                      msg.put[':'] = s
                      return eve.to.next(msg)
                    }
                  )
                })
              }
            }
          },
          {
            raw: 1
          }
        )
      })
      return
    }
    SEA.opt.pack(msg.put, (packed) => {
      SEA.verify(packed, raw['*'] || pub, (data) => {
        let tmp
        data = SEA.opt.unpack(data)
        if (undefined === data) return no('Unverified data.') // make sure the signature matches the account it claims to be on. // reject any updates that are signed with a mismatched account.
        if ((tmp = link_is(data)) && pub === SEA.opt.pub(tmp)) { (at.sea.own[tmp] = at.sea.own[tmp] || {})[pub] = 1 }

        // check if cert ('+') and putter's pub ('*') exist
        if (raw['+'] && raw['+'].m && raw['+'].s && raw['*'])
        // now verify certificate
        {
          verify(raw['+'], raw['*'], () => {
            msg.put['='] = data
            return eve.to.next(msg)
          })
        } else {
          msg.put['='] = data
          return eve.to.next(msg)
        }
      })
    })
  }
  check.any = (eve, msg, val, key, soul, at, no) => {
    if (at.opt.secure) {
      return no(`Soul missing public key at '${key}'.`)
    }
    // TODO: Ask community if should auto-sign non user-graph data.
    at.on('secure', function (msg) {
      this.off()
      if (!at.opt.secure) {
        return eve.to.next(msg)
      }
      no('Data cannot be changed.')
    }).on.on('secure', msg)
  }
  const valid = Gun.valid
  var link_is = (d, l) => typeof (l = valid(d)) === 'string' && l
  const state_ify = (Gun.state || '').ify
  const pubcut = /[^\w_-]/ // anything not alphanumeric or _ -
  SEA.opt.pub = (s) => {
    if (!s) {
      return
    }
    s = s.split('~')
    if (!s || !(s = s[1])) {
      return
    }
    s = s.split(pubcut).slice(0, 2)
    if (!s || s.length != 2) {
      return
    }
    if ((s[0] || '')[0] === '@') {
      return
    }
    s = s.slice(0, 2).join('.')
    return s
  }
  SEA.opt.stringy = () => {
    // TODO: encrypt etc. need to check string primitive. Make as breaking change.
  }
  SEA.opt.pack = (d, cb, k, n, s) => {
    let tmp // pack for verifying
    let f
    if (SEA.opt.check(d)) {
      return cb(d)
    }
    if (d && d['#'] && d['.'] && d['>']) {
      tmp = d[':']
      f = 1
    }
    __usable_globalThis.jsonParseAsync(f ? tmp : d, (err, meta) => {
      const sig = undefined !== (meta || '')[':'] && (meta || '')['~'] // or just ~ check?
      if (!sig) {
        cb(d)
        return
      }
      cb({
        m: {
          '#': s || d['#'],
          '.': k || d['.'],
          ':': (meta || '')[':'],
          '>': d['>'] || Gun.state.is(n, k)
        },
        s: sig
      })
    })
  }
  const O = SEA.opt
  SEA.opt.unpack = (d, k, n) => {
    let tmp
    if (undefined === d) {
      return
    }
    if (d && undefined !== (tmp = d[':'])) {
      return tmp
    }
    k = k || O.fall_key
    if (!n && O.fall_val) {
      n = {}
      n[k] = O.fall_val
    }
    if (!k || !n) {
      return
    }
    if (d === n[k]) {
      return d
    }
    if (!SEA.opt.check(n[k])) {
      return d
    }
    const soul = (n && n._ && n._['#']) || O.fall_soul
    const s = Gun.state.is(n, k) || O.fall_state
    if (
      d &&
			d.length === 4 &&
			soul === d[0] &&
			k === d[1] &&
			fl(s) === fl(d[3])
    ) {
      return d[2]
    }
    if (s < SEA.opt.shuffle_attack) {
      return d
    }
  }
  SEA.opt.shuffle_attack = 1546329600000 // Jan 1, 2019
  var fl = Math.floor // TODO: Still need to fix inconsistent state issue.
  // TODO: Potential bug? If pub/priv key starts with `-`? IDK how possible.
}

import mathRandomPlugin from './../usableLib/mathRandomPlugin.js'
import ysonPlugin from './yson.js'
import radmigtmpPlugin from './radmigtmp.js'
import gunPlugin from '../gun.js'
import radixPlugin from './radix.js'
let __usable_isActivated = false
const __usable_module = {}

/**
 *
 * @param __usable_environment
 * @param __usable_MODULE
 */
export default function (__usable_environment) {
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
  const __usable_require =
		__usable_environment.environmentHint !== 'server'
		  ? undefined
		  : () => {
		      throw new Error(
		        'It should not be possible to call this function, please open an issue in `usable-gun` to have this fixed.'
		      )
		    }
  mathRandomPlugin(__usable_environment);
  (() => {
    /**
		 *
		 * @param opt
		 */
    function Radisk (opt) {
      opt = opt || {}
      opt.log = opt.log || __usable_globalThis.debug.log
      opt.file = String(opt.file || 'radata')
      const has = (Radisk.has || (Radisk.has = {}))[opt.file]
      if (has) {
        return has
      }
      opt.max =
				opt.max || (opt.memory ? opt.memory * 999 * 999 : 300000000) * 0.3
      opt.until = opt.until || opt.wait || 250
      opt.batch = opt.batch || 10 * 1000
      opt.chunk = opt.chunk || 1024 * 1024 * 1 // 1MB
      opt.code = opt.code || {}
      opt.code.from = opt.code.from || '!'
      opt.jsonify = true
      /**
			 *
			 * @param t
			 */
      function ename (t) {
        return encodeURIComponent(t).replace(/\*/g, '%2A')
      } // TODO: Hash this also, but allow migration!
      /**
			 *
			 * @param v
			 */
      function atomic (v) {
        return undefined !== v && (!v || typeof v !== 'object')
      }
      const timediate =
				typeof __usable_globalThis.setImmediate === 'undefined'
				  ? setTimeout
				  : __usable_globalThis.setImmediate
      const puff = __usable_globalThis.settimeoutTurn || timediate
      const map = Radix.object
      let ST = 0
      if (!opt.store) {
        return opt.log(
          'ERROR: Radisk needs `opt.store` interface with `{get: fn, put: fn (, list: fn)}`!'
        )
      }
      if (!opt.store.put) {
        return opt.log(
          'ERROR: Radisk needs `store.put` interface with `(file, data, cb)`!'
        )
      }
      if (!opt.store.get) {
        return opt.log(
          'ERROR: Radisk needs `store.get` interface with `(file, cb)`!'
        )
      }
      if (!opt.store.list) {
        // opt.log("WARNING: `store.list` interface might be needed!");
      }
      if (typeof __usable_require !== 'undefined') {
        ysonPlugin(__usable_environment)
      }
      const parse =
				__usable_globalThis.jsonParseAsync ||
				((t, cb, r) => {
				  try {
				    cb(undefined, JSON.parse(t, r))
				  } catch (e) {
				    cb(e)
				  }
				})
      __usable_globalThis.jsonStringifyAsync ||
				((v, cb, r, s) => {
				  try {
				    cb(undefined, JSON.stringify(v, r, s))
				  } catch (e) {
				    cb(e)
				  }
				})
      /*
      	Any and all storage adapters should...
      	1. Because writing to disk takes time, we should batch data to disk. This improves performance, and reduces potential disk corruption.
      	2. If a batch exceeds a certain number of writes, we should immediately write to disk when physically possible. This caps total performance, but reduces potential loss.
      */
      const r = (key, data, cb, tag, DBG) => {
        if (typeof data === 'function') {
          const o = cb || {}
          cb = data
          r.read(key, cb, o, DBG || tag)
          return
        }
        // var tmp = (tmp = r.batch = r.batch || {})[key] = tmp[key] || {};
        // var tmp = (tmp = r.batch = r.batch || {})[key] = data;
        r.save(key, data, cb, tag, DBG)
      }
      r.save = (key, data, cb, tag, DBG) => {
        const s = {
          key
        }

        let f
        let d
        let q
        s.find = (file) => {
          let tmp
          s.file = file || (file = opt.code.from)
          DBG && (DBG = DBG[file] = DBG[file] || {})
          DBG && (DBG.sf = DBG.sf || Number(new Date()))
          // console.only.i && console.log('found', file);
          if ((tmp = r.disk[file])) {
            s.mix(undefined, tmp)
            return
          }
          r.parse(file, s.mix, undefined, DBG)
        }
        s.mix = (err, disk) => {
          DBG && (DBG.sml = Number(new Date()))
          DBG && (DBG.sm = DBG.sm || Number(new Date()))
          if ((s.err = err || s.err)) {
            cb(err)
            return
          } // TODO: HANDLE BATCH EMIT
          const file = (s.file = (disk || '').file || s.file)
          let tmp
          if (!disk && file !== opt.code.from) {
            // corrupt file?
            r.find.bad(file) // remove from dir list
            r.save(key, data, cb, tag) // try again
            return
          }
          (disk = r.disk[file] || (r.disk[file] = disk || Radix())).file ||
						(disk.file = file)
          if (opt.compare) {
            data = opt.compare(disk(key), data, key, file)
            if (undefined === data) {
              cb(err, -1)
              return
            } // TODO: HANDLE BATCH EMIT
          }
          (s.disk = disk)(key, data)
          if (tag) {
            (tmp =
							(tmp = disk.tags || (disk.tags = {}))[tag] ||
							(tmp[tag] = r.tags[tag] || (r.tags[tag] = {})))[file] ||
							(tmp[file] = r.one[tag] || (r.one[tag] = cb))
            cb = null
          }
          DBG && (DBG.st = DBG.st || Number(new Date()))
          // console.only.i && console.log('mix', disk.Q);
          if (disk.Q) {
            cb && disk.Q.push(cb)
            return
          }
          disk.Q = cb ? [cb] : []
          disk.to = setTimeout(s.write, opt.until)
        }
        s.write = () => {
          DBG && (DBG.sto = DBG.sto || Number(new Date()))
          const file = (f = s.file)
          const disk = (d = s.disk)
          q = s.q = disk.Q
          s.tags = disk.tags
          delete disk.Q
          delete r.disk[file]
          delete disk.tags
          // console.only.i && console.log('write', file, disk, 'was saving:', key, data);
          r.write(file, disk, s.ack, undefined, DBG)
        }
        s.ack = (err, ok) => {
          DBG && (DBG.sa = DBG.sa || Number(new Date()))
          DBG && (DBG.sal = q.length)
          let ack
          let tmp
          // TODO!!!! CHANGE THIS INTO PUFF!!!!!!!!!!!!!!!!
          for (const id in r.tags) {
            if (!r.tags.hasOwnProperty(id)) {
              continue
            }
            const tag = r.tags[id]
            if ((tmp = r.disk[f]) && (tmp = tmp.tags) && tmp[tag]) {
              continue
            }
            ack = tag[f]
            delete tag[f]
            var ne
            for (const k in tag) {
              if (tag.hasOwnProperty(k)) {
                ne = true
                break
              }
            } // is not empty?
            if (ne) {
              continue
            } // if(!obj_empty(tag)){ continue }
            delete r.tags[tag]
            ack && ack(err, ok)
          }
          !q && (q = '')
          const l = q.length
          let i = 0
          // TODO: PERF: Why is acks so slow, what work do they do??? CHECK THIS!!
          // TODO: PERF: Why is acks so slow, what work do they do??? CHECK THIS!!
          // TODO: PERF: Why is acks so slow, what work do they do??? CHECK THIS!!
          // TODO: PERF: Why is acks so slow, what work do they do??? CHECK THIS!!
          // TODO: PERF: Why is acks so slow, what work do they do??? CHECK THIS!!
          // TODO: PERF: Why is acks so slow, what work do they do??? CHECK THIS!!
          // TODO: PERF: Why is acks so slow, what work do they do??? CHECK THIS!!
          const S = Number(new Date())
          for (; i < l; i++) {
            (ack = q[i]) && ack(err, ok)
          }
          __usable_globalThis.debug.STAT &&
						__usable_globalThis.debug.STAT(
						  S,
						  Number(new Date()) - S,
						  'rad acks',
						  ename(s.file)
						)
          __usable_globalThis.debug.STAT &&
						__usable_globalThis.debug.STAT(
						  S,
						  q.length,
						  'rad acks #',
						  ename(s.file)
						)
        }
        cb ||
					(cb = (err) => {
					  // test delete!
					  if (!err) {
					  }
					})
        // console.only.i && console.log('save', key);
        r.find(key, s.find)
      }
      r.disk = {}
      r.one = {}
      r.tags = {}

      /*
      	Any storage engine at some point will have to do a read in order to write.
      	This is true of even systems that use an append only log, if they support updates.
      	Therefore it is unavoidable that a read will have to happen,
      	the question is just how long you delay it.
      */
      let RWC = 0
      r.write = (file, rad, cb, o, DBG) => {
        if (!rad) {
          cb('No radix!')
          return
        }
        o =
					typeof o === 'object'
					  ? o
					  : {
					      force: o
					    }
        const f = () => {}
        let a
        let b
        f.text = ''
        f.file = file = rad.file || (rad.file = file)
        if (!file) {
          cb('What file?')
          return
        }
        f.write = () => {
          const text = (rad.raw = f.text)
          r.disk[(file = rad.file || f.file || file)] = rad
          const S = Number(new Date())
          DBG && (DBG.wd = S)
          // console.only.i && console.log('add', file);
          r.find.add(file, (err) => {
            DBG && (DBG.wa = Number(new Date()))
            if (err) {
              cb(err)
              return
            }
            // console.only.i && console.log('disk', file, text);
            opt.store.put(ename(file), text, (err, ok) => {
              DBG && (DBG.wp = Number(new Date()))
              __usable_globalThis.debug.STAT &&
								__usable_globalThis.debug.STAT(
								  S,
								  (ST = Number(new Date()) - S),
								  'wrote disk',
								  JSON.stringify(file),
								  ++RWC,
								  'total all writes.'
								)
              // console.only.i && console.log('done', err, ok || 1, cb);
              cb(err, ok || 1)
              if (!rad.Q) {
                delete r.disk[file]
              } // VERY IMPORTANT! Clean up memory, but not if there is already queued writes on it!
            })
          })
        }
        f.split = () => {
          const S = Number(new Date())
          DBG && (DBG.wf = S)
          f.text = ''
          if (!f.count) {
            f.count = 0
            Radix.map(rad, () => {
              f.count++
            }) // TODO: Perf? Any faster way to get total length?
          }
          DBG && (DBG.wfc = f.count)
          f.limit = Math.ceil(f.count / 2)
          const SC = f.count
          f.count = 0
          DBG && (DBG.wf1 = Number(new Date()))
          f.sub = Radix()
          Radix.map(rad, f.slice, {
            reverse: 1
          }) // IMPORTANT: DO THIS IN REVERSE, SO LAST HALF OF DATA MOVED TO NEW FILE BEFORE DROPPING FROM CURRENT FILE.
          DBG && (DBG.wf2 = Number(new Date()))
          r.write(f.end, f.sub, f.both, o)
          DBG && (DBG.wf3 = Number(new Date()))
          f.hub = Radix()
          Radix.map(rad, f.stop)
          DBG && (DBG.wf4 = Number(new Date()))
          r.write(rad.file, f.hub, f.both, o)
          DBG && (DBG.wf5 = Number(new Date()))
          __usable_globalThis.debug.STAT &&
						__usable_globalThis.debug.STAT(
						  S,
						  Number(new Date()) - S,
						  'rad split',
						  ename(rad.file),
						  SC
						)
          return true
        }
        f.slice = (val, key) => {
          f.sub((f.end = key), val)
          if (f.limit <= ++f.count) {
            return true
          }
        }
        f.stop = (val, key) => {
          if (key >= f.end) {
            return true
          }
          f.hub(key, val)
        }
        f.both = (err, ok) => {
          DBG && (DBG.wfd = Number(new Date()))
          if (b) {
            cb(err || b)
            return
          }
          if (a) {
            cb(err, ok)
            return
          }
          a = true
          b = err
        }
        f.each = (val, key, k, pre) => {
          if (undefined !== val) {
            f.count++
          }
          if (opt.max <= (val || '').length) {
            return cb('Data too big!'), true
          }
          const enc =
						`${Radisk.encode(pre.length)
						}#${
							Radisk.encode(k)
						}${undefined === val ? '' : `:${Radisk.encode(val)}`
						}\n`
          if (
            opt.chunk < f.text.length + enc.length &&
						f.count > 1 &&
						!o.force
          ) {
            return f.split()
          }
          f.text += enc
        }
        // console.only.i && console.log('writing');
        if (opt.jsonify) {
          r.write.jsonify(f, rad, cb, o, DBG)
          return
        } // temporary testing idea
        if (!Radix.map(rad, f.each, true)) {
          f.write()
        }
      }
      r.write.jsonify = (f, rad, cb, o, DBG) => {
        let raw
        const S = Number(new Date())
        DBG && (DBG.w = S)
        try {
          raw = JSON.stringify(rad.$)
        } catch (e) {
          cb('Cannot radisk!')
          return
        }
        DBG && (DBG.ws = Number(new Date()))
        __usable_globalThis.debug.STAT &&
					__usable_globalThis.debug.STAT(
					  S,
					  Number(new Date()) - S,
					  'rad stringified JSON'
					)
        if (opt.chunk < raw.length && !o.force) {
          let c = 0
          Radix.map(rad, () => {
            if (c++) {
              return true
            } // more than 1 item
          })
          if (c > 1) {
            return f.split()
          }
        }
        f.text = raw
        f.write()
      }
      r.range = (tree, o) => {
        if (!tree || !o) {
          return
        }
        if (undefined === o.start && undefined === o.end) {
          return tree
        }
        if (atomic(tree)) {
          return tree
        }
        const sub = Radix()
        Radix.map(
          tree,
          (v, k) => {
            sub(k, v)
          },
          o
        ) // ONLY PLACE THAT TAKES TREE, maybe reduce API for better perf?
        return sub('')
      };
      (() => {
        r.read = (key, cb, o, DBG) => {
          o = o || {}
          const g = {
            key
          }
          g.find = (file) => {
            let tmp
            g.file = file || (file = opt.code.from)
            DBG && (DBG = DBG[file] = DBG[file] || {})
            DBG && (DBG.rf = DBG.rf || Number(new Date()))
            if ((tmp = r.disk[(g.file = file)])) {
              g.check(undefined, tmp)
              return
            }
            r.parse(file, g.check, undefined, DBG)
          }
          g.get = (err, disk, info) => {
            DBG && (DBG.rgl = Number(new Date()))
            DBG && (DBG.rg = DBG.rg || Number(new Date()))
            if ((g.err = err || g.err)) {
              cb(err)
              return
            }
            const file = (g.file = (disk || '').file || g.file)
            if (!disk && file !== opt.code.from) {
              // corrupt file?
              r.find.bad(file) // remove from dir list
              r.read(key, cb, o) // try again
              return
            }
            disk = r.disk[file] || (r.disk[file] = disk)
            if (!disk) {
              cb(file === opt.code.from ? undefined : 'No file!')
              return
            }
            disk.file || (disk.file = file)
            const data = r.range(disk(key), o)
            DBG && (DBG.rr = Number(new Date()))
            o.unit = disk.unit
            o.chunks = (o.chunks || 0) + 1
            o.parsed =
							(o.parsed || 0) + ((info || '').parsed || o.chunks * opt.chunk)
            o.more = 1
            o.next = undefined
            Radix.map(
              r.list,
              (v, f) => {
                if (!v || file === f) {
                  return
                }
                o.next = f
                return 1
              },
              o.reverse
                ? {
                    reverse: 1,
                    end: file
                  }
                : {
                    start: file
                  }
            )
            DBG && (DBG.rl = Number(new Date()))
            if (!o.next) {
              o.more = 0
            }
            if (o.next) {
              if (
                !o.reverse &&
								((key < o.next && o.next.indexOf(key) != 0) ||
									(undefined !== o.end && (o.end || '\uffff') < o.next))
              ) {
                o.more = 0
              }
              if (
                o.reverse &&
								((key > o.next && key.indexOf(o.next) != 0) ||
									(undefined !== o.start &&
										(o.start || '') > o.next &&
										file <= o.start))
              ) {
                o.more = 0
              }
            }
            // console.log(5, process.memoryUsage().heapUsed);
            if (!o.more) {
              cb(g.err, data, o)
              return
            }
            if (data) {
              cb(g.err, data, o)
            }
            if (o.parsed >= o.limit) {
              return
            }
            const S = Number(new Date())
            DBG && (DBG.rm = S)
            const next = o.next
            timediate(() => {
              __usable_globalThis.debug.STAT &&
								__usable_globalThis.debug.STAT(S, Number(new Date()) - S, 'rad more')
              r.parse(next, g.check)
            }, 0)
          }
          g.check = (err, disk, info) => {
            // console.log(4, process.memoryUsage().heapUsed);
            g.get(err, disk, info)
            if (!disk || disk.check) {
              return
            }
            disk.check = 1
            const S = Number(new Date());
            (info || (info = {})).file || (info.file = g.file)
            Radix.map(disk, (val, key) => {
              // assume in memory for now, since both write/read already call r.find which will init it.
              r.find(key, (file) => {
                if ((file || (file = opt.code.from)) === info.file) {
                  return
                }
                const id = (`${__usable_globalThis.mathRandom()}`).slice(-3)
                puff(() => {
                  r.save(key, val, function ack (err) {
                    if (err) {
                      r.save(key, val, ack)
                      return
                    } // ad infinitum???
                    // TODO: NOTE!!! Mislocated data could be because of a synchronous `put` from the `g.get(` other than perf shouldn't we do the check first before acking?
                    __usable_globalThis.debug.STAT &&
											__usable_globalThis.debug.STAT(
											  'MISLOCATED DATA CORRECTED',
											  id,
											  ename(key),
											  ename(info.file),
											  ename(file)
											)
                  })
                }, 0)
              })
            })
            __usable_globalThis.debug.STAT &&
							__usable_globalThis.debug.STAT(S, Number(new Date()) - S, 'rad check')
          }
          r.find(key || (o.reverse ? o.end || '' : o.start || ''), g.find)
        }
      })();
      (() => {
        /*
        	Let us start by assuming we are the only process that is
        	changing the directory or bucket. Not because we do not want
        	to be multi-process/machine, but because we want to experiment
        	with how much performance and scale we can get out of only one.
        	Then we can work on the harder problem of being multi-process.
        */
        let RPC = 0
        const Q = {}
        const s = String.fromCharCode(31)
        r.parse = (file, cb, raw, DBG) => {
          let q
          if (!file) {
            return cb()
          }
          if ((q = Q[file])) {
            q.push(cb)
            return
          }
          q = Q[file] = [cb]
          const p = function Parse () {}

          const info = {
            file
          };

          (p.disk = Radix()).file = file
          p.read = (err, data) => {
            let tmp
            DBG && (DBG.rpg = Number(new Date()))
            __usable_globalThis.debug.STAT &&
							__usable_globalThis.debug.STAT(
							  S,
							  Number(new Date()) - S,
							  'read disk',
							  JSON.stringify(file),
							  ++RPC,
							  'total all parses.'
							)
            // console.log(2, process.memoryUsage().heapUsed);
            if ((p.err = err) || (p.not = !data)) {
              delete Q[file]
              p.map(q, p.ack)
              return
            }
            if (typeof data !== 'string') {
              try {
                if (opt.max <= data.length) {
                  p.err = 'Chunk too big!'
                } else {
                  data = data.toString() // If it crashes, it crashes here. How!?? We check size first!
                }
              } catch (e) {
                p.err = e
              }
              if (p.err) {
                delete Q[file]
                p.map(q, p.ack)
                return
              }
            }
            info.parsed = data.length
            DBG && (DBG.rpl = info.parsed)
            DBG && (DBG.rpa = q.length)
            S = Number(new Date())
            if (!(opt.jsonify || data[0] === '{')) {
              p.radec(err, data)
              return
            }
            parse(data, (err, tree) => {
              // console.log(3, process.memoryUsage().heapUsed);
              if (!err) {
                delete Q[file]
                p.disk.$ = tree
                __usable_globalThis.debug.STAT &&
									(ST = Number(new Date()) - S) > 9 &&
									__usable_globalThis.debug.STAT(S, ST, 'rad parsed JSON')
                DBG && (DBG.rpd = Number(new Date()))
                p.map(q, p.ack) // hmmm, v8 profiler can't see into this cause of try/catch?
                return
              }
              if (data[0] === '{') {
                delete Q[file]
                p.err = tmp || 'JSON error!'
                p.map(q, p.ack)
                return
              }
              p.radec(err, data)
            })
          }
          p.map = () => {
            // switch to setTimeout.each now?
            if (!q || !q.length) {
              return
            }
            // var i = 0, l = q.length, ack;
            const S = Number(new Date())
            const err = p.err
            const data = p.not ? undefined : p.disk
            let i = 0
            let ack
            while (i < 9 && (ack = q[i++])) {
              ack(err, data, info)
            } // too much?
            __usable_globalThis.debug.STAT &&
							__usable_globalThis.debug.STAT(
							  S,
							  Number(new Date()) - S,
							  'rad packs',
							  ename(file)
							)
            __usable_globalThis.debug.STAT &&
							__usable_globalThis.debug.STAT(S, i, 'rad packs #', ename(file))
            if (!(q = q.slice(i)).length) {
              return
            }
            puff(p.map, 0)
          }
          p.ack = (cb) => {
            if (!cb) {
              return
            }
            if (p.err || p.not) {
              cb(p.err, undefined, info)
              return
            }
            cb(undefined, p.disk, info)
          }
          p.radec = (err, data) => {
            delete Q[file]
            S = Number(new Date())
            let tmp = p.split(data)
            let pre = []
            let i
            let k
            let v
            if (!tmp || tmp[1] !== 0) {
              p.err = `File '${file}' does not have root radix! `
              p.map(q, p.ack)
              return
            }
            while (tmp) {
              k = v = undefined
              i = tmp[1]
              tmp = p.split(tmp[2]) || ''
              if (tmp[0] == '#') {
                k = tmp[1]
                pre = pre.slice(0, i)
                if (i <= pre.length) {
                  pre.push(k)
                }
              }
              tmp = p.split(tmp[2]) || ''
              if (tmp[0] == '\n') {
                continue
              }
              if (tmp[0] == '=' || tmp[0] == ':') {
                v = tmp[1]
              }
              if (undefined !== k && undefined !== v) {
                p.disk(pre.join(''), v)
              }
              tmp = p.split(tmp[2])
            }
            __usable_globalThis.debug.STAT &&
							__usable_globalThis.debug.STAT(S, Number(new Date()) - S, 'parsed RAD')
            p.map(q, p.ack)
          }
          p.split = (t) => {
            if (!t) {
              return
            }
            const l = []
            const o = {}
            let i = -1
            let a = ''
            let b
            let c
            i = t.indexOf(s)
            if (!t[i]) {
              return
            }
            a = t.slice(0, i)
            l[0] = a
            l[1] = b = Radisk.decode(t.slice(i), o)
            l[2] = t.slice(i + o.i)
            return l
          }
          if (r.disk) {
            raw || (raw = (r.disk[file] || '').raw)
          }
          var S = Number(new Date())
          let SM
          let SL
          DBG && (DBG.rp = S)
          if (raw) {
            return puff(() => {
              p.read(undefined, raw)
            }, 0)
          }
          opt.store.get(ename(file), p.read)
          // TODO: What if memory disk gets filled with updates, and we get an old one back?
        }
      })();
      (() => {
        let dir
        const f = String.fromCharCode(28)
        let Q
        r.find = (key, cb) => {
          if (!dir) {
            if (Q) {
              Q.push([key, cb])
              return
            }
            Q = [[key, cb]]
            r.parse(f, init)
            return
          }
          Radix.map(
            (r.list = dir),
            (val, key) => {
              if (!val) {
                return
              }
              return cb(key) || true
            },
            {
              reverse: 1,
              end: key
            }
          ) || cb(opt.code.from)
        }
        r.find.add = (file, cb) => {
          const has = dir(file)
          if (has || file === f) {
            cb(undefined, 1)
            return
          }
          dir(file, 1)
          cb.found = (cb.found || 0) + 1
          r.write(
            f,
            dir,
            (err, ok) => {
              if (err) {
                cb(err)
                return
              }
              cb.found = (cb.found || 0) - 1
              if (cb.found !== 0) {
                return
              }
              cb(undefined, 1)
            },
            true
          )
        }
        r.find.bad = (file, cb) => {
          dir(file, 0)
          r.write(f, dir, cb || noop)
        }
        /**
				 *
				 * @param err
				 * @param disk
				 */
        function init (err, disk) {
          if (err) {
            opt.log('list', err)
            setTimeout(() => {
              r.parse(f, init)
            }, 1000)
            return
          }
          if (disk) {
            drain(disk)
            return
          }
          dir = dir || disk || Radix()
          if (!opt.store.list) {
            drain(dir)
            return
          }
          // import directory.
          opt.store.list((file) => {
            if (!file) {
              drain(dir)
              return
            }
            r.find.add(file, noop)
          })
        }
        /**
				 *
				 * @param rad
				 * @param tmp
				 */
        function drain (rad, tmp) {
          dir = dir || rad
          dir.file = f
          tmp = Q
          Q = null
          map(tmp, (arg) => {
            r.find(arg[0], arg[1])
          })
        }
      })()
      try {
        !Gun.window && radmigtmpPlugin(__usable_environment)(r)
      } catch (e) {}
      var noop = () => {}
      Radisk.has[opt.file] = r
      return r
    }
    (() => {
      const _ = String.fromCharCode(31)
      Radisk.encode = (d, o, s) => {
        s = s || _
        let t = s
        let tmp
        if (typeof d === 'string') {
          let i = d.indexOf(s)
          while (i != -1) {
            t += s
            i = d.indexOf(s, i + 1)
          }
          return `${t}"${d}${s}`
        } else if (d && d['#'] && Object.keys(d).length == 1) {
          return `${t}#${tmp}${t}`
        } else if (typeof d === 'number') {
          return `${t}+${d || 0}${t}`
        } else if (d === null) {
          return `${t} ${t}`
        } else if (d === true) {
          return `${t}+${t}`
        } else if (d === false) {
          return `${t}-${t}`
        } // else
        // if(binary){}
      }
      Radisk.decode = (t, o, s) => {
        s = s || _
        let d = ''
        let i = -1
        let n = 0
        let c
        let p
        if (s !== t[0]) {
          return
        }
        while (s === t[++i]) {
          ++n
        }
        p = t[(c = n)] || true
        while (--n >= 0) {
          i = t.indexOf(s, i + 1)
        }
        if (i == -1) {
          i = t.length
        }
        d = t.slice(c + 1, i)
        if (o) {
          o.i = i + 1
        }
        if (p === '"') {
          return d
        } else if (p === '#') {
          return {
            '#': d
          }
        } else if (p === '+') {
          if (d.length === 0) {
            return true
          }
          return parseFloat(d)
        } else if (p === ' ') {
          return null
        } else if (p === '-') {
          return false
        }
      }
    })()
    if (typeof __usable_window !== 'undefined') {
      var Gun = __usable_window.Gun
      var Radix = __usable_window.Radix
      __usable_window.Radisk = Radisk
    } else {
      var Gun = gunPlugin(__usable_environment)
      var Radix = radixPlugin(__usable_environment)
      // var Radix = require('./radix2'); Radisk = require('./radisk2');
      try {
        __usable_module.exports = Radisk
      } catch (e) {}
    }
    Radisk.Radix = Radix
  })()
  __usable_environment.exports.lib.radisk = __usable_module.exports
  return __usable_module.exports
}

import gunPlugin from '../gun.js'
import nodeFsImport from 'node:fs'
import nodePathImport from 'node:path'
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

  // Take caution running this in production, it ONLY saves to disk what is in memory.

  const Gun = gunPlugin(__usable_environment)

  const fs = nodeFsImport
  Gun.on('opt', function (ctx) {
    this.to.next(ctx)
    const opt = ctx.opt
    if (ctx.once) {
      return
    }
    opt.file = String(opt.file || 'data.json')
    const graph = ctx.graph
    let acks = {}
    let count = 0
    let to
    const disk =
			Gun.obj.ify(
			  (fs.existsSync || nodePathImport.existsSync)(opt.file)
			    ? fs.readFileSync(opt.file).toString()
			    : null
			) || {}
    ctx.on('put', function (at) {
      this.to.next(at)
      Gun.graph.is(at.put, null, map)
      if (!at['@']) {
        acks[at['#']] = true
      } // only ack non-acks.
      count += 1
      if (count >= (opt.batch || 10000)) {
        return flush()
      }
      if (to) {
        return
      }
      to = setTimeout(flush, opt.wait || 1)
    })
    ctx.on('get', function (at) {
      this.to.next(at)
      const lex = at.get
      let soul
      let data
      // setTimeout(function(){
      if (!lex || !(soul = lex['#'])) {
        return
      }
      // if(0 >= at.cap){ return }
      const field = lex['.']
      data = disk[soul] || undefined
      if (data && field) {
        data = Gun.state.to(data, field)
      }
      ctx.on('in', {
        '@': at['#'],
        put: Gun.graph.node(data)
      })
      // },11);
    })
    var map = (val, key, node, soul) => {
      disk[soul] = Gun.state.to(node, key, disk[soul])
    }
    let wait
    var flush = () => {
      if (wait) {
        return
      }
      wait = true
      clearTimeout(to)
      to = false
      const ack = acks
      acks = {}
      fs.writeFile(opt.file, JSON.stringify(disk, null, 2), (err) => {
        wait = false
        const tmp = count
        count = 0
        Gun.obj.map(ack, (yes, id) => {
          ctx.on('in', {
            '@': id,
            err,
            ok: 0 // memdisk should not be relied upon as permanent storage.
          })
        })
        if (tmp > 1) {
          flush()
        }
      })
    }
  })
}

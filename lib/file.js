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

  // This was written by the wonderful Forrest Tait
  // modified by Mark to be part of core for convenience
  // twas not designed for production use
  // only simple local development.

  const Gun = gunPlugin(__usable_environment)

  const fs = nodeFsImport
  Gun.on('create', function (root) {
    this.to.next(root)
    const opt = root.opt
    if (opt.localStorage !== true) {
      return
    }
    if (opt.localStorage === false) {
      return
    }
    // if(process.env.RAD_ENV){ return }
    // if(process.env.AWS_S3_BUCKET){ return }
    opt.file = String(opt.file || 'data.json')
    const graph = root.graph
    let acks = {}
    let count = 0
    let to
    const disk =
			Gun.obj.ify(
			  (fs.existsSync || nodePathImport.existsSync)(opt.file)
			    ? fs.readFileSync(opt.file).toString()
			    : null
			) || {}
    Gun.log.once(
      'file-warning',
      'WARNING! This `file.js` module for gun is ' +
				'intended for local development testing only!'
    )
    root.on('put', function (at) {
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
    root.on('get', function (at) {
      this.to.next(at)
      const lex = at.get
      let soul
      let data
      // setTimeout(function(){
      if (!lex || !(soul = lex['#'])) {
        return
      }
      // if(0 >= at.cap){ return }
      if (Gun.obj.is(soul)) {
        return match(at)
      }
      const field = lex['.']
      data = disk[soul] || undefined
      if (data && field) {
        data = Gun.state.to(data, field)
      }
      root.on('in', {
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
      clearTimeout(to)
      to = false
      const ack = acks
      acks = {}
      fs.writeFile(opt.file, JSON.stringify(disk), (err) => {
        wait = false
        const tmp = count
        count = 0
        Gun.obj.map(ack, (yes, id) => {
          root.on('in', {
            '@': id,
            err,
            ok: err ? undefined : 1
          })
        })
        if (tmp > 1) {
          flush()
        }
      })
    }
    /**
		 *
		 * @param at
		 */
    function match (at) {
      const rgx = at.get['#']
      const has = at.get['.']
      Gun.obj.map(disk, (node, soul, put) => {
        if (!Gun.text.match(soul, rgx)) {
          return
        }
        if (has) {
          node = Gun.state.to(node, has)
        }
        (put = {})[soul] = node
        root.on('in', {
          put,
          '@': at['#']
        })
      })
    }
  })
}

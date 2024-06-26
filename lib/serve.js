import nodeFsImport from 'node:fs'
import nodePathImport from 'node:path'
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
  const __usable_dirname =
		__usable_environment.environmentHint !== 'server' ? undefined : 'lib'

  /* BEGIN WRAPPED GUN CODE */

  const fs = nodeFsImport
  const path = nodePathImport
  const dot = /\.\.+/g
  const slash = /\/\/+/g
  /**
	 *
	 * @param dir
	 */
  function CDN (dir) {
    return (req, res) => {
      req.url = (req.url || '').replace(dot, '').replace(slash, '/')
      if (serve(req, res)) {
        return
      } // filters GUN requests!
      if (req.url.slice(-3) === '.js') {
        res.writeHead(200, {
          'Content-Type': 'text/javascript'
        })
      }
      fs.createReadStream(path.join(dir, req.url))
        .on('error', () => {
          // static files!
          fs.readFile(path.join(dir, 'index.html'), (err, tmp) => {
            try {
              res.writeHead(200, {
                'Content-Type': 'text/html'
              })
              res.end(`${tmp}`)
            } catch (e) {} // or default to index
          })
        })
        .pipe(res) // stream
    }
  }
  /**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
  function serve (req, res, next) {
    let tmp
    if (typeof req === 'string') {
      return CDN(req)
    }
    if (!req || !res) {
      return false
    }
    next = next || serve
    if (!req.url) {
      return next()
    }
    if (res.setHeader) {
      res.setHeader('Access-Control-Allow-Origin', '*')
    }
    if (req.url.indexOf('gun.js') >= 0) {
      res.writeHead(200, {
        'Content-Type': 'text/javascript'
      })
      res.end(
        (serve.js =
					serve.js ||
					nodeFsImport.readFileSync(`${__usable_dirname}/../gun.js`))
      )
      return true
    }
    if (req.url.indexOf('gun/') >= 0) {
      const path =
				`${__usable_dirname}/../${req.url.split('/').slice(2).join('/')}`
      if (path.slice(-1) === '/') {
        fs.readdir(path, (err, dir) => {
          res.end(`${dir || (err && 404)}`)
        })
        return true
      }
      const S = Number(new Date())
      const rs = fs.createReadStream(path)
      rs.on('open', () => {
        __usable_globalThis.debug.STAT &&
					__usable_globalThis.debug.STAT(S, Number(new Date()) - S, 'serve file open')
        rs.pipe(res)
      })
      rs.on('error', () => {
        res.end(`${404}`)
      })
      rs.on('end', () => {
        __usable_globalThis.debug.STAT &&
					__usable_globalThis.debug.STAT(S, Number(new Date()) - S, 'serve file end')
      })
      return true
    }
    if ((tmp = req.socket) && (tmp = tmp.server) && (tmp = tmp.route)) {
      if (
        (tmp =
					tmp[((req.url || '').slice(1).split('/')[0] || '').split('.')[0]])
      ) {
        try {
          return tmp(req, res, next)
        } catch (e) {
          __usable_globalThis.debug.log(`${req.url} crashed with ${e}`)
        }
      }
    }
    return next()
  }
  __usable_module.exports = serve
  __usable_environment.exports.lib.serve = __usable_module.exports
  return __usable_module.exports
}

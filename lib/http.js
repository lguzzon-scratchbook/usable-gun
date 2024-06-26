import gunPlugin from '../gun.js'
import formidableImport from 'formidable'
import nodeUrlImport from 'node:url'
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
  /* BEGIN WRAPPED GUN CODE */

  const Gun = gunPlugin(__usable_environment)
  __usable_module.exports = (req, res, next) => {
    next = next || (() => {}) // if not next, and we don't handle it, we should res.end
    if (!req || !res) {
      return next()
    }
    if (!req.url) {
      return next()
    }
    if (!req.method) {
      return next()
    }
    const msg = {}
    msg.url = nodeUrlImport.parse(req.url, true)
    msg.method = (req.method || '').toLowerCase()
    msg.headers = req.headers
    let body
    const form = new formidableImport.IncomingForm()

    const post = (err, body) => {
      if (undefined !== body) {
        msg.body = body
      }
      next(msg, (reply) => {
        if (!res) {
          return
        }
        if (!reply) {
          return res.end()
        }
        if (Gun.obj.has(reply, 'statusCode') || Gun.obj.has(reply, 'status')) {
          res.statusCode = reply.statusCode || reply.status
        }
        if (reply.headers) {
          if (
            !(
              res.headersSent ||
							res.headerSent ||
							res._headerSent ||
							res._headersSent
            )
          ) {
            Gun.obj.map(reply.headers, (val, field) => {
              if (val !== 0 && !val) {
                return
              }
              res.setHeader(field, val)
            })
          }
        }
        if (Gun.obj.has(reply, 'chunk') || Gun.obj.has(reply, 'write')) {
          res.write(Gun.text.ify(reply.chunk || reply.write) || '')
        }
        if (Gun.obj.has(reply, 'body') || Gun.obj.has(reply, 'end')) {
          res.end(Gun.text.ify(reply.body || reply.end) || '')
        }
      })
    }

    form
      .on('field', (k, v) => {
        (body = body || {})[k] = v
      })
      .on('file', () => {})
      .on('error', (e) => {
        if (form.done) {
          return
        }
        post(e)
      })
      .on('end', () => {
        if (form.done) {
          return
        }
        post(null, body)
      })
    form.parse(req)
  }
  __usable_environment.exports.lib.http = __usable_module.exports
  return __usable_module.exports
}

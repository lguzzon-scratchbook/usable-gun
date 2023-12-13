import gunPlugin from '../gun.js'
import radiskPlugin from './radisk.js'
import nodeFsImport from 'node:fs'
import awsSdkImport from 'aws-sdk'
import rfsmixPlugin from './rfsmix.js'
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
		      }
  /* BEGIN WRAPPED GUN CODE */

  const Gun = gunPlugin(__usable_environment)
  const Radisk = radiskPlugin(__usable_environment)
  Radisk.Radix
  let AWS
  Gun.on('create', function (root) {
    this.to.next(root)
    const opt = root.opt
    if (!opt.s3 && !__usable_process.env.AWS_S3_BUCKET) {
      return
    }
    // opt.batch = opt.batch || (1000 * 10);
    // opt.until = opt.until || (1000 * 3); // ignoring these now, cause perf > cost
    // opt.chunk = opt.chunk || (1024 * 1024 * 10); // 10MB // when cost only cents

    try {
      AWS = awsSdkImport
    } catch (e) {
      __usable_globalThis.debug.log(
        'Please `npm install aws-sdk` or add it to your package.json !'
      )
      __usable_globalThis.AWS_SDK_NOT_INSTALLED
    }
    const opts = opt.s3 || (opt.s3 = {})
    opts.bucket = opts.bucket || __usable_process.env.AWS_S3_BUCKET
    opts.region = opts.region || __usable_process.env.AWS_REGION || 'us-east-1'
    opts.accessKeyId = opts.key =
			opts.key || opts.accessKeyId || __usable_process.env.AWS_ACCESS_KEY_ID
    opts.secretAccessKey = opts.secret =
			opts.secret ||
			opts.secretAccessKey ||
			__usable_process.env.AWS_SECRET_ACCESS_KEY
    if ((opt.fakes3 = opt.fakes3 || __usable_process.env.fakes3)) {
      opts.endpoint = opt.fakes3
      opts.sslEnabled = false
      opts.bucket = opts.bucket.replace('.', 'p')
    }
    opts.config = new AWS.Config(opts)
    opts.s3 = opts.s3 || new AWS.S3(opts.config)
    opt.store = Object.keys(opts.s3).length === 0 ? opt.store : Store(opt)
  })
  /**
	 *
	 * @param opt
	 */
  function Store (opt) {
    opt = opt || {}
    opt.file = String(opt.file || 'radata')
    const opts = opt.s3
    const s3 = opts.s3
    const c = {
      p: {},
      g: {},
      l: {}
    }
    const store = () => {}
    if (Store[opt.file]) {
      __usable_globalThis.debug.log(
        'Warning: reusing same S3 store and options as 1st.'
      )
      return Store[opt.file]
    }
    Store[opt.file] = store
    store.put = (file, data, cb) => {
      const params = {
        Bucket: opts.bucket,
        Key: file,
        Body: data
      }
      // console.log("RS3 PUT ---->", (data||"").slice(0,20));
      c.p[file] = data
      delete c.g[file] // Gun.obj.del(c.g, file);
      delete c.l[1] // Gun.obj.del(c.l, 1);
      s3.putObject(params, (err) => {
        delete c.p[file]
        cb(err, 's3')
      })
    }
    store.get = (file, cb) => {
      let tmp
      if ((tmp = c.p[file])) {
        cb(undefined, tmp)
        return
      }
      if ((tmp = c.g[file])) {
        tmp.push(cb)
        return
      }
      const cbs = (c.g[file] = [cb])
      const params = {
        Bucket: opts.bucket,
        Key: file || ''
      }
      // console.log("RS3 GET ---->", file);
      s3.getObject(params, (err, ack) => {
        if (err && err.code === 'NoSuchKey') {
          err = undefined
        }
        // console.log("RS3 GOT <----", err, file, cbs.length, ((ack||{}).Body||'').length);//.toString().slice(0,20));
        delete c.g[file] // Gun.obj.del(c.g, file);
        var data
        var data = (ack || '').Body

        // console.log(1, process.memoryUsage().heapUsed);
        let i = 0

        let cba
        while ((cba = cbs[i++])) {
          cba && cba(err, data)
        } // Gun.obj.map(cbs, cbe);
      })
    }
    store.list = (cb, match, params, cbs) => {
      if (!cbs) {
        if (c.l[1]) {
          return c.l[1].push(cb)
        }
        cbs = c.l[1] = [cb]
      }
      params = params || {
        Bucket: opts.bucket
      }
      // console.log("RS3 LIST --->");
      s3.listObjectsV2(params, (err, data) => {
        // console.log("RS3 LIST <---", err, data, cbs.length);
        if (err) {
          return Gun.log(err, err.stack)
        }
        const IT = data.IsTruncated
        // Gun.obj.map(cbs, cbe); // lets see if fixes heroku
        if (!IT) {
          delete c.l[1]
          return
        }
        params.ContinuationToken = data.NextContinuationToken
        store.list(cb, match, params, cbs)
      })
    }
    // store.list(function(){ return true });
    if (opt.rfs !== false) {
      rfsmixPlugin(__usable_environment)(opt, store)
    } // ugly, but gotta move fast for now.
    return store
  }
  __usable_module.exports = Store
  __usable_environment.exports.lib.rs3 = __usable_module.exports
  return __usable_module.exports
}

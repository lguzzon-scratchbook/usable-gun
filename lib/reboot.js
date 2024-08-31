import nodeChildProcessImport from 'node:child_process'
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
  const __usable_dirname =
		__usable_environment.environmentHint !== 'server' ? undefined : 'lib';

  /* BEGIN WRAPPED GUN CODE */ (() => {
    const exec = nodeChildProcessImport.execSync
    const dir = __usable_dirname
    let tmp
    try {
      exec('crontab -l')
    } catch (e) {
      tmp = e
    }
    if (tmp.toString().indexOf('no') < 0) {
      return
    }
    try {
      tmp = exec('which node').toString()
    } catch (e) {
      __usable_globalThis.debug.log(e)
      return
    }
    try {
      tmp = exec(
				`echo "@reboot ${
					tmp
				} ${
					dir
				}/../examples/http.js" > ${
					dir
				}/reboot.cron`
      )
    } catch (e) {
      __usable_globalThis.debug.log(e)
      return
    }
    try {
      tmp = exec(`crontab ${dir}/reboot.cron`)
    } catch (e) {
      __usable_globalThis.debug.log(e)
      return
    }
    __usable_globalThis.debug.log(tmp.toString())
  })()
}

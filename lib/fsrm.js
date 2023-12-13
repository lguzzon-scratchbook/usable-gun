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
  const __usable_dirname =
		__usable_environment.environmentHint !== 'server' ? undefined : 'lib'

  /* BEGIN WRAPPED GUN CODE */

  const fs = nodeFsImport
  __usable_module.exports = function rm (path, full) {
    path = full || nodePathImport.join(`${__usable_dirname}/../`, path)
    if (!fs.existsSync(path)) {
      return
    }
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = `${path}/${file}`
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        rm(null, curPath)
      } else {
        // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
  __usable_environment.exports.lib.fsrm = __usable_module.exports
  return __usable_module.exports
}

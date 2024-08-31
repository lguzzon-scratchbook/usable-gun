import metaMetaCorePlugin from './meta/metaCore.js'
import metaMetaUIPlugin from './meta/metaUI.js'
import metaMetaEventsPlugin from './meta/metaEvents.js'
let __usable_isActivated = false
const __usable_module = {}

/**
 *
 * @param __usable_environment
 * @param __usable_MODULE
 */
export default function (__usable_environment) {
  if (__usable_isActivated) return __usable_module.exports
  __usable_isActivated = true;
  (() => {
    const __usable_MODULE = {}
    metaMetaCorePlugin(__usable_environment, __usable_MODULE)
    metaMetaUIPlugin(__usable_environment, __usable_MODULE)
    metaMetaEventsPlugin(__usable_environment, __usable_MODULE)
    __usable_module.exports = __usable_MODULE.exports
  })()
  __usable_environment.exports.lib.meta = __usable_module.exports
  return __usable_module.exports
}

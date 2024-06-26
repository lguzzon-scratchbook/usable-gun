import nodeUrlImport from 'node:url'
import gunPlugin from '../gun.js'
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

  /**
	 * Verify the origin.
	 *
	 * @param  {RegExp | Array | string | Function} allowed  -  The allowed origins.
	 * @param  {string}              origin   -  String representation of the request URL.
	 * @returns {boolean}             Whether or not the origin is valid.
	 */
  const verifyOrigin = (allowed, origin) => {
    let isValid = false
    if (allowed instanceof RegExp) {
      isValid = allowed.test(origin)
    } else if (allowed instanceof Array) {
      isValid = allowed.indexOf(origin) !== -1
    } else if (allowed instanceof Function) {
      isValid = allowed(origin)
    } else {
      isValid = allowed === origin
    }
    return isValid
  }

  /**
	 * Verify the authentication header.
	 *
	 * @todo  make this callback based
	 *
	 * @param  {Function|String} check       Check option passed in
	 * @param  {String}          authToken   The auth token passed in query string
	 * @param  {Object}          query       Full query string as an object
	 * @return {Boolean}         Whether or not the auth header is valid
	 */
  const verifyAuth = (check, authToken, query) => {
    let isValid = false
    if (check instanceof Function) {
      isValid = check(authToken, query)
    } else {
      isValid = check === authToken
    }
    return isValid === true
  }
  Gun.on('opt', function (context) {
    const opt = context.opt || {}
    const ws = opt.ws || {}
    if (!opt.verify) {
      this.to.next(context)
      return
    }

    /**
		 *  Verify when instantiating Gun can contain the following keys:
		 *      allowOrigins: Array|RegExp|String
		 *      auth:         String|Function
		 *      authKey:      String
		 *      check:        Function.
		 */
    const verify = opt.verify
    if (ws.verifyClient && !verify.override) {
      throw Error(
        'Cannot override existing verifyClient option in `ws` configuration.'
      )
    }

    /**
		 * Attach a verifyClient to the WS configuration.
		 *
		 * @param  {object}   info     -  Request information.
		 * @param  {Function} callback -  Called when verification is complete.
		 */
    ws.verifyClient = (info, callback) => {
      // Callback Definitions
      const errorCallback = (errorCode, message) => {
        callback(false, errorCode, message)
      }
      const successCallback = () => {
        callback(true)
      }

      // 0. Verify security
      if (verify.requireSecure && !info.secure) {
        errorCallback(400, 'Insecure connection')
        return
      }

      // 1. Verify request origin
      if (
        verify.allowOrigins &&
				!verifyOrigin(verify.allowOrigins, info.origin)
      ) {
        errorCallback(403, 'Origin forbidden')
        return
      }

      // 2. Check authentication
      if (verify.auth) {
        // Retrieve parameters from the query string
        // and convert into an object
        const queryUrl = nodeUrlImport.parse(info.req.url, true)
        queryUrl.query = queryUrl.query || {}

        // Get the header defined by the user
        // Or use authorization by default.
        const token = verify.authKey
          ? queryUrl.query[verify.authKey]
          : queryUrl.query.authorization

        // Check the token against the verification function
        if (!token || !verifyAuth(verify.auth, token, queryUrl.query)) {
          errorCallback(403, 'Forbidden')
          return
        }
      }

      // If no additional verification check is provided,
      // simply return true at this point since all
      // provided verifications have passed.
      if (!verify.check) {
        successCallback()
        return
      }

      // 3. Pass to generic check handler
      // This can return a value; alternatively, this can use the
      // callback functionality
      const isValid = verify.check(info, successCallback, errorCallback)

      // Check returned a response, pass this to the callback
      // If not, assume the user will call
      if (typeof isValid !== 'undefined') {
        if (typeof isValid === 'boolean') {
          if (isValid === true) {
            successCallback()
          } else {
            errorCallback(400)
          }
        }
      }
    }
    context.opt.ws = ws

    // Pass to next plugins
    this.to.next(context)
  })
  __usable_module.exports = Gun
  __usable_environment.exports.lib.verify = __usable_module.exports
  return __usable_module.exports
}

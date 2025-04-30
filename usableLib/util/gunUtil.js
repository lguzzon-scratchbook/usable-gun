/**
 * @function
 * @param {*} val - The value to check
 * @returns {boolean} - Whether the value is a simple type (string, number, boolean, or null)
 * @description
 *   This function takes a value and returns a boolean indicating whether it is one of the simple types:
 *   string, number, boolean, or null.
 */
export const validSimpleValue = (val) =>
  typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean' || val === null

/**
 * @function
 * @param {*} val - The value to check
 * @returns {boolean} - Whether the value is of type object or one of the simple types (string|number|boolean|null)
 * @description
 *   This function takes a value and returns a boolean indicating whether it is of type object or one of the simple types (string|number|boolean|null)
 */
export const validValue = (val) => typeof val === 'object' || validSimpleValue(val)

/**
 * @function
 * @param {string} path - The path to a key
 * @returns {{key: string, path: string}} - An object with the key and the path to it
 * @description
 *   This function takes a path string and returns an object with the key and the path to the key.
 *   It does this by splitting the path string into an array of elements, popping the last element off as the key,
 *   and joining the rest of the elements with a '/' to form the path to the key.
 */
export const getKeyAndPath = (path) => {
  const pathArray = path.split(/\/|\\|\./)
  const key = pathArray.pop()
  return { key, path: pathArray.join('/') }
}

/**
 * @function
 * @param {string[]} pathArray - The array of strings representing the path to the key
 * @param {Gun} baseRef - A base Gun reference
 * @returns {Gun} - A reference to the Gun node at the path
 * @description
 *   This function takes an array of path elements and a reference to a Gun instance,
 *   and returns a reference to the Gun node at the path.
 *   It does this by calling `get(key)` on each path element in order, and returning
 *   the result.
 */
const getRefFromPathArray = (pathArray, baseRef) =>
  pathArray.reduce((ref, key) => ref.get(key), baseRef)

/**
 * @function
 * @param {string} path - The path to the key
 * @param {Gun} baseRef - A base Gun reference
 * @returns {Gun} - A reference to the Gun node at the path
 */
export const getRefFromPath = (path, baseRef) =>
  getRefFromPathArray(path.split(/\/|\\|\./), baseRef)

const normKeyRegex = /\\|\./g
/**
 * @function
 * @param {string} path - The path to the key
 * @returns {string} - The normalized path to the key
 * @description
 *   This function takes a path string and returns a normalized version of it.
 *   It does this by replacing each occurrence of '\\' or '.' with a '/' character.
 *   This is necessary because Gun uses '/' as the path separator, but users may
 *   input paths with different separators.
 */
export const normPath = (path) => path.replaceAll(normKeyRegex, '/')

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
  );
  (() => {
    // Book
    __usable_globalThis.debug.log('Warning: Book is in alpha!')
    const B =
			__usable_globalThis.settimeoutBook ||
			(__usable_globalThis.settimeoutBook = (text) => {
			  const b = (word, is) => {
			    const has = b.all[word]
			    let p
			    if (is === undefined) {
			      return (has && has.is) || b.get(has || word)
			    }
			    if (has) {
			      if ((p = has.page)) {
			        p.size += size(is) - size(has.is)
			        p.text = ''
			      }
			      has.text = ''
			      has.is = is
			      return b
			    }
			    // b.all[word] = {is: word}; return b;
			    return b.set(word, is)
			  }
			  b.list = [
			    {
			      from: text,
			      size: (text || '').length,
			      substring: sub,
			      toString: to,
			      book: b
			    }
			  ]
			  b.page = page
			  b.set = set
			  b.get = get
			  b.all = {}
			  return b
			})
    /**
		 *
		 * @param word
		 */
    function page (word) {
      const b = this
      const l = b.list
      const i = spot(B.encode(word), l)
      let p = l[i]
      if (typeof p === 'string') {
        l[i] = p = {
          size: -1,
          first: p,
          substring: sub,
          toString: to,
          book: b
        }
      } // TODO: test, how do we arrive at this condition again?
      return p
      // TODO: BUG! What if we get the page, it turns out to be too big & split, we must then RE get the page!
    }
    /**
		 *
		 * @param word
		 */
    function get (word) {
      if (!word) {
        return
      }
      if (undefined !== word.is) {
        return word.is
      } // JS falsey values!
      const b = this
      var has = b.all[word]
      if (has) {
        return has.is
      }

      // get does an exact match, so we would have found it already, unless parseless page:
      const page = b.page(word)

      let l
      var has
      let a
      let i
      if (!page || !page.from) {
        return
      } // no parseless data
      if ((l = from(page))) {
        has = l[(i = spot(B.encode(word), l))]
      }
      if (has && word == has.word) {
        return (b.all[word] = has).is
      }
      if (typeof has !== 'string') {
        return
      }
      a = slot(has) // Escape!
      if (word != a[0]) {
        has = l[(i += 1)] // edge case bug?
        a = slot(has) // edge case bug?
        if (word != a[0]) {
          return
        }
      }
      has =
				l[i] =
				b.all[word] =
					{
					  word,
					  is: a[1],
					  page,
					  substring: subt,
					  toString: tot
					} // TODO: convert to a JS value!!! Maybe index! TODO: BUG word needs a page!!!! TODO: Check for other types!!!
      return has.is
    }
    /**
		 *
		 * @param word
		 * @param sorted
		 */
    function spot (word, sorted) {
      const L = sorted
      let min = 0
      let page
      const l = word.length
      let max = L.length
      let i = max / 2
      while (
        (word < (page = (L[(i = i >> 0)] || '').substring()) ||
					((L[i + 1] || '').substring() || 0) <= word) &&
				i != min
      ) {
        // L[i] <= word < L[i+1]
        i += page < word ? (max - (min = i)) / 2 : -((max = i) - min) / 2
      }
      return i
    }
    /**
		 *
		 * @param a
		 * @param t
		 * @param l
		 */
    function from (a, t, l) {
      if (typeof a.from !== 'string') {
        return a.from
      }
      (l = a.from =
				(t = a.from || '').substring(1, t.length - 1).split(t[0])).toString =
				join // slot
      return l
    }
    /**
		 *
		 * @param word
		 * @param is
		 */
    function set (word, is) {
      const b = this
      let has = b.all[word]
      if (has) {
        return b(word, is)
      } // updates to in-memory items will always match exactly.
      const page = b.page(word) // before we assume this is an insert tho, we need to check
      let tmp
      if (page && page.from) {
        // if it could be an update to an existing word from parseless.
        b.get(word)
        if (b.all[word]) {
          return b(word, is)
        }
      }
      // MUST be an insert:
      has = b.all[word] = {
        word,
        is,
        page,
        substring: subt,
        toString: tot
      }
      page.first = page.first < (tmp = B.encode(word)) ? page.first : tmp
      if (!page.list) {
        (page.list = []).toString = join
      }
      page.list.push(has)
      page.sort = 1
      b(word, is)
      page.size += size(word) + size(is)
      if (2 ** 12 < page.size) {
        split(page, b)
      }
      return b
    }
    /**
		 *
		 * @param p
		 * @param b
		 */
    function split (p, b) {
      // console.time();
      const L = (p.list = p.list.sort())

      const l = L.length
      let i = (l / 2) >> 0
      const j = i
      const half = L[j]
      let tmp

      // console.timeEnd();
      const next = {
        list: [],
        first: B.encode(half.substring()),
        size: 0,
        substring: sub,
        toString: to,
        book: b
      }

      const nl = next.list
      nl.toString = join
      // console.time();
      while ((tmp = L[i++])) {
        nl.push(tmp)
        next.size += (tmp.is || '').length || 1
        tmp.page = next
      }
      // console.timeEnd();
      // console.time();
      p.list = p.list.slice(0, j)
      p.size -= next.size
      p.sort = 0
      b.list.splice(spot(next.first, b.list) + 1, 0, next)
      // console.timeEnd();
      if (b.split) {
        b.split(next, p)
      }
    }
    /**
		 *
		 * @param t
		 */
    function slot (t) {
      return (t = t || '').substring(1, t.length - 1).split(t[0])
    }
    B.slot = slot
    /**
		 *
		 * @param t
		 */
    function size (t) {
      return (t || '').length || 1
    } // bits/numbers less size? Bug or feature?
    /**
		 *
		 */
    function subt () {
      return this.word
    }
    // function tot(){ return this.text = this.text || "'"+(this.word)+"'"+(this.is)+"'" }
    /**
		 *
		 */
    function tot () {
      let tmp
      if ((tmp = this.page) && tmp.saving) {
        delete tmp.book.all[this.word]
      }
      return (this.text = this.text || `'${this.word}'${this.is}'`)
    }
    /**
		 *
		 * @param i
		 * @param j
		 */
    function sub (i, j) {
      return (this.first || this.word || (from(this) || '')[0] || '').substring(
        i,
        j
      )
    }
    /**
		 *
		 */
    function to () {
      return (this.text = this.text || text(this))
    }
    /**
		 *
		 */
    function join () {
      return this.join('|')
    }
    /**
		 *
		 * @param p
		 */
    function text (p) {
      if (!p.list) {
        return `${p.from || ''}`
      }
      if (!p.from) {
        return (
					`|${(p.list && (p.list = p.list.sort()).join('|')) || ''}|`
        )
      }
      return `|${from(p).concat(p.list).sort().join('|')}|`
    }
    B.encode = (d, _) => {
      _ = _ || "'"
      if (typeof d === 'string') {
        let i = d.indexOf(_)
        let t = ''
        while (i != -1) {
          t += _
          i = d.indexOf(_, i + 1)
        }
        return t + _ + d + _
      }
    }
    B.hash = (s, c) => {
      // via SO
      if (typeof s !== 'string') {
        return
      }
      c = c || 0 // CPU schedule hashing by
      if (!s.length) {
        return c
      }
      for (var i = 0, l = s.length, n; i < l; ++i) {
        n = s.charCodeAt(i)
        c = (c << 5) - c + n
        c |= 0
      }
      return c
    }
    try {
      __usable_module.exports = B
    } catch (e) {}
  })()
  __usable_environment.exports.lib.book = __usable_module.exports
  return __usable_module.exports
}

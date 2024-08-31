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
  const __usable_window =
		__usable_environment.environmentHint !== 'browser'
		  ? undefined
		  : new Proxy('window' in globalThis ? window : globalThis, {
		    get (target, property) {
		      if (['window', 'globalThis', 'global'].includes(property)) {
		        return __usable_window
		      } else if (__usable_environment.library[property] !== undefined) {
		        return __usable_environment.library[property]
		      } else if ('window' in globalThis) {
		        return window[property]
		      } else {
		        return undefined
		      }
		    },
		    set (object, property, value) {
		      __usable_environment.library[property] = value
		      return true
		    }
		  });
  (() => {
    /**
		 *
		 * @param el
		 * @param gun
		 * @param cb
		 * @param opt
		 */
    function as (el, gun, cb, opt) {
      el = __usable_globalThis.$(el)
      if (gun === as.gui && as.el && as.el.is(el)) {
        return
      }
      opt = opt || {}
      opt.match = opt.match || '{{ '
      opt.end = opt.end || ' }}';
      (() => {
        // experimental
        /**
				 *
				 * @param t
				 * @param s
				 * @param e
				 * @param r
				 * @param i
				 * @param tmp
				 * @param undefined
				 */
        function nest (t, s, e, r, i, tmp, undefined) {
          if (r && !r.length) {
            return t || ''
          }
          if (!t) {
            return []
          }
          e = e || s
          i = t.indexOf(s, i || 0)
          if (i < 0) {
            return []
          }
          tmp = t.indexOf(e, i + 1)
          if (!r) {
            return [t.slice(i + s.length, tmp)].concat(
              nest(t, s, e, r, tmp, tmp, undefined)
            )
          }
          return (
            t.slice(0, i) +
						r[0] +
						nest(t.slice(tmp + e.length), s, e, r.slice(1), 0, tmp, undefined)
          )
        }

        /* experimental */
        /**
				 *
				 * @param tag
				 * @param attr
				 */
        function template (tag, attr) {
          const html = (tag = __usable_globalThis.$(tag))[0].outerHTML
          let sub
          let tmp
          if (html && html.indexOf(opt.match) < 0) {
            return
          }
          if (!attr) {
            __usable_globalThis.$.each(tag[0].attributes, (i, v) => {
              if (!v) {
                return
              }
              if (!nest(v.value, opt.match, opt.end).length) {
                return
              }
              template(tag, v.name)
            })
            if ((sub = tag.children()).length) {
              return sub.each(function () {
                template(this)
              })
            }
          }
          const data = []
          const plate = attr ? tag.attr(attr) : tag.html()
          tmp = nest(plate, opt.match, opt.end)
          if (!tmp.length) {
            return
          }
          __usable_globalThis.$.each(tmp, (pos, match) => {
            let expr = match.split(' ')
            let path = expr[0].split('.')
            if ((expr = expr.slice(1).join(' '))) {
              expr = new Function('_', 'b', `return (_)${expr}`)
            }
            const val = (expr && expr('')) || ''
            data.push(val)
            if (!attr) {
              tag.text(val)
            }
            let ref = gun
            const sup = []
            let tmp
            if ((tmp = tag.attr('name'))) {
              sup.push(tmp)
            }
            tag.parents('[name]').each(function () {
              sup.push(__usable_globalThis.$(this).attr('name'))
            })
            __usable_globalThis.$.each(
              (path = sup.reverse().concat(path)),
              (i, v) => {
                ref = ref.get(v)
              }
            )
            ref.on((v) => {
              v = data[pos] = expr ? expr(v) : v
              const tmp = nest(plate, opt.match, opt.end, data)
              if (attr) {
                tag.attr(attr, tmp)
              } else {
                tag.text(tmp)
              }
            })
          })
        }
        template(el)
      })()
      as.gui = gun
      as.el = el
      if (el.data('as')) {
        el.html(el.data('as').fresh)
      } else {
        el.data('as', {
          fresh: el.html()
        })
      }
      el.find('[name]').each(function () {
        if (__usable_globalThis.$(this).find('[name]').length) {
          return
        }
        const name = __usable_globalThis.$(this)
        const parents = name.parents('[name]')
        let path = []
        let ref = gun
        path.push(name.attr('name'))
        parents.each(function () {
          path.push(__usable_globalThis.$(this).attr('name'))
        })
        path = path.reverse()
        path.forEach((key) => {
          if (key === '#') {
            ref = ref.map()
          } else {
            ref = ref.get(key)
          }
        })
        let many = path.slice().reverse().indexOf('#')
        let model
        many = ++many > 0 ? many : false
        if (many) {
          model = name.closest("[name='#']")
          model =
						model.data('model') ||
						model
						  .data('model', {
						    $: model.clone(),
						    on: model.parent(),
						    has: {}
						  })
						  .hide()
						  .data('model')
        }
        ref.get((at) => {
          const data = at.put
          const key = at.get
          const gui = at.gun || at.$
          let ui = name
          let back
          if (model) {
            ui = model.has[gui._.id]
            if (!ui) {
              back = gui.back(many - 1)
              ui = model.has[back._.id]
              if (!ui) {
                if (!back._.get) {
                  return
                }
                ui = model.has[back._.id] = model.$.clone(true).prependTo(
                  model.on
                )
              }
              ui = ui.find(`[name='${key}']`).first()
              model.has[gui._.id] = ui
            }
          }
          ui.data('gun', gui)
          if (ui.data('was') === data) {
            return
          }
          if (many && ui.is('.sort')) {
            const up = ui.closest("[name='#']")
            const tmp = as.sort(data, up.parent().children().last())
            tmp ? up.insertAfter(tmp) : up.prependTo(up.parent())
          }
          if (as.lock === gui) {
            return
          }
          if (!(data && data instanceof Object)) {
            ui[0] && undefined === ui[0].value ? ui.text(data) : ui.val(data)
          }
          ui.data('was', data)
          if (cb) {
            cb(data, key, ui)
          }
        })
      })
    }
    as.wait = (cb, wait, to) => function (a, b, c) {
      let me = (as.typing = this)
      clearTimeout(to)
      to = setTimeout(() => {
        cb.call(me, a, b, c)
        as.typing = me = false
      }, wait || 200)
    }
    as.sort = function sort (num, li) {
      return parseFloat(num) >=
				parseFloat(__usable_globalThis.$(li).find('.sort').text() || -Infinity)
        ? li
        : sort(num, li.prev())
    }
    __usable_globalThis.$(document).on(
      'keyup',
      'input, textarea, [contenteditable]',
      as.wait(function () {
        const el = __usable_globalThis.$(this)
        const data = el[0] && undefined === el[0].value ? el.text() : el.val()
        const g = el.data('gun')
        if (!g) {
          return
        }
        as.lock = g
        g.put(data)
      }, 99)
    )
    // $(document).on('submit', 'form', function(e){ e.preventDefault() });

    __usable_window.as = as
    __usable_globalThis.$.as = as
  })();
  (() => {
    __usable_globalThis.$(document).on('click', 'a, button', function (e) {
      const tmp = __usable_globalThis.$(this).attr('href') || ''
      if (tmp.indexOf('http') === 0) {
        return
      }
      e.preventDefault()
      r(tmp)
    })
    /**
		 *
		 * @param href
		 */
    function r (href) {
      if (!href) {
        return
      }
      if (href[0] == '#') {
        href = href.slice(1)
      }
      const h = href.split('/')[0]
      __usable_globalThis.$('.page').hide()
      __usable_globalThis.$(`#${h}`).show()
      if (r.on === h) {
        return
      }
      (
        r.page[h] || {
          on () {}
        }
      ).on()
      r.on = h
      return r
    }
    r.page = (h, cb) => {
      r.page[h] = r.page[h] || {
        on: cb
      }
      return r
    }
    r.render = (id, model, onto, data) => {
      const $data = __usable_globalThis.$(
        __usable_globalThis.$(`#${id}`).get(0) ||
					__usable_globalThis
					  .$('.model')
					  .find(model)
					  .clone(true)
					  .attr('id', id)
					  .appendTo(onto)
      )
      __usable_globalThis.$.each(data, (field, val) => {
        if (__usable_globalThis.$.isPlainObject(val)) {
          return
        }
        $data
          .find(`[name='${field}']`)
          .val(val)
          .text(val)
      })
      return $data
    }
    __usable_window.onhashchange = () => {
      r(location.hash.slice(1))
    }
    __usable_globalThis.$.as && (__usable_globalThis.$.as.route = r)
    if (__usable_window.as) {
      __usable_globalThis.as.route = r
    } else {
      __usable_globalThis.$.route = r
    }
  })()
  __usable_globalThis.$(() => {
    __usable_globalThis.$('.page').not(':first').hide()
    __usable_globalThis.$.as.route(location.hash.slice(1))
    __usable_globalThis.$(
      (__usable_globalThis.JOY.start =
				__usable_globalThis.JOY.start ||
				(() => {
				  __usable_globalThis.$.as(
				    document,
				    __usable_globalThis.gun,
				    null,
				    __usable_globalThis.JOY.opt
				  )
				}))
    )
    if (__usable_globalThis.$('body').attr('peers')) {
      (__usable_globalThis.debug.warn || __usable_globalThis.debug.log)(
        'Warning: Please upgrade <body peers=""> to https://github.com/eraeco/joydb#peers !'
      )
    }
  });
  (() => {
    // need to isolate into separate module!
    const joy = (__usable_window.JOY = () => {})
    joy.auth = (a, b, cb, o) => {
      if (!o) {
        o = cb
        cb = 0
      }
      if (o === true) {
        __usable_globalThis.gun.user().create(a, b)
        return
      }
      __usable_globalThis.gun.user().auth(a, b, cb, o)
    }
    const opt = (joy.opt = __usable_window.CONFIG || {})
    let peers
    __usable_globalThis.$('link[type=peer]').each(function () {
      (peers || (peers = [])).push(__usable_globalThis.$(this).attr('href'))
    })
    !__usable_window.gun &&
			(opt.peers =
				opt.peers ||
				peers ||
				(() => {
				  (__usable_globalThis.debug.warn || __usable_globalThis.debug.log)(
				    'Warning: No peer provided, defaulting to DEMO peer. Do not run in production, or your data will be regularly wiped, reset, or deleted. For more info, check https://github.com/eraeco/joydb#peers !'
				  )
				  return ['https://gunjs.herokuapp.com/gun']
				})())
    __usable_window.gun = __usable_window.gun || __usable_globalThis.Gun(opt)
    __usable_globalThis.gun.on('auth', (ack) => {
      __usable_globalThis.debug.log(
        'Your namespace is publicly available at',
        ack.soul
      )
    })
  })()
}

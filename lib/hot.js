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
  );
  (() => {
    // on fires when shortcut keydowns or on touch after command selected and then touchdown
    const m = __usable_globalThis.meta
    m.edit({
      name: 'Add',
      combo: ['A']
    })
    m.edit({
      name: 'Row',
      combo: ['A', 'R'],
      on () {
        m.tap().append(
          '<div class="hold center" style="min-height: 9em; padding: 2%;">'
        )
      }
    })
    m.edit({
      name: 'Columns',
      combo: ['A', 'C'],
      on () {
        const on = m.tap()
        let tmp
        let c
        let html =
					'<div class="unit col" style="min-height: 9em; padding: 2%;"></div>'
        if (!on.children('.col').length) {
          html += html
        }
        c = (tmp = on.append(html).children('.col')).length
        tmp.each(function () {
          __usable_globalThis.$(this).css('width', `${100 / c}%`)
        })
      }
    })
    m.edit({
      name: 'Text',
      combo: ['A', 'T'],
      on () {
        m.tap().append('<p contenteditable="true">Text</p>')
      }
    })
    m.edit({
      name: 'Drag',
      combo: ['D']
    });
    (() => {
      __usable_globalThis.$(document).on('click', () => {
        const tmp = __usable_globalThis.$('.m-on')
        if (!tmp.length) {
          return
        }
        tmp.removeClass('m-on')
      })
      m.edit({
        combo: [38],
        // up
        on () {
          let on = m.tap().removeClass('m-on')
          on = on.prev().or(on.parent()).or(on)
          on.addClass('m-on')
        },
        up () {}
      })
      m.edit({
        combo: [40],
        // down
        on () {
          let on = m.tap().removeClass('m-on')
          on = on.next().or(on.children().first()).or(on)
          on.addClass('m-on')
        },
        up () {}
      })
      m.edit({
        combo: [39],
        // right
        on () {
          let on = m.tap().removeClass('m-on')
          on = on.children().first().or(on.next()).or(on.parent()).or(on)
          on.addClass('m-on')
        },
        up () {}
      })
      m.edit({
        combo: [37],
        // left
        on () {
          let on = m.tap().removeClass('m-on')
          on = on.parent().or(on)
          on.addClass('m-on')
        },
        up () {}
      })
    })()
    m.edit({
      name: 'Turn',
      combo: ['T']
    })
    m.edit({
      name: 'Size',
      combo: ['S']
    })
    m.edit({
      name: 'X',
      combo: ['S', 'X'],
      on () {
        const on = m.tap()
        const was = on.width()
        __usable_globalThis.$(document).on('mousemove.tmp', (eve) => {
          const be = was + ((eve.pageX || 0) - was)
          on.css({
            'max-width': be,
            width: '100%'
          })
        })
      },
      up () {
        __usable_globalThis.$(document).off('mousemove.tmp')
      }
    })
    m.edit({
      name: 'Y',
      combo: ['S', 'Y'],
      on () {
        const on = m.tap()
        const was = on.height()
        __usable_globalThis.$(document).on('mousemove.tmp', (eve) => {
          const be = was + ((eve.pageY || 0) - was)
          on.css({
            'min-height': be
          })
        })
      },
      up () {
        __usable_globalThis.$(document).off('mousemove.tmp')
      }
    })
    m.edit({
      name: 'Fill',
      combo: ['F'],
      on () {
        const on = m.tap()
        m.ask('Color name, code, or URL?', (color) => {
          const css = on.closest('p').length ? 'color' : 'background'
          on.css(css, color)
        })
      }
    })
  })()
}

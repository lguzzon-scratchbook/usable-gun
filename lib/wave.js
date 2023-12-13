import mathRandomPlugin from './../usableLib/mathRandomPlugin.js'
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
		  })
  /* BEGIN WRAPPED GUN CODE */

  /**
	 * Create music from text.
	 * Examples/wave.html.
	 *
	 * Music Makers is an application using the same libraries as Wave:
	 * https://github.com/jussiry/musicmakers
	 * http://edide.xyz/musicmakers.app
	 * https://edide.io/musicmakers.app.
	 */
  mathRandomPlugin(__usable_environment);
  (() => {
    let MODSELF
    const edide = {}
    edide.global = (() => typeof __usable_globalThis !== 'undefined'
      ? __usable_globalThis
      : __usable_window).call((MODSELF = {}), edide, MODSELF)
    edide.set = (function (edide, set) {
      Object.defineProperty(this, 'module_name', {
        value: 'set'
      })
      set = (...args) => new Set(args)
      set.addArr = (s, arr) => {
        let i
        let len
        for (i = 0, len = arr.length; i < len; i++) {
          s.add(arr[i])
        }
      }
      set.map = (s, func) => Array.from(s).map(func)
      return set
    }.call((MODSELF = {}), edide, MODSELF))
    edide.membrameSynth = (function (edide, membrameSynth) {
      Object.defineProperty(this, 'module_name', {
        value: 'membrameSynth'
      })
      this.startNote = 'A0'
      this.init = () => {
        let bd
        let compressor
        let distortion
        let gain
        let reverb
        distortion = new __usable_globalThis.Tone.Distortion({
          distortion: 0.1,
          oversample: '4x' // none, 2x, 4x
        })
        reverb = new __usable_globalThis.Tone.Freeverb(0.75, 1000)
        gain = new __usable_globalThis.Tone.Gain(0.5)
        compressor = new __usable_globalThis.Tone.Compressor({
          ratio: 12,
          threshold: -24,
          release: 0.05,
          attack: 0.003,
          knee: 1
        })
        bd = new __usable_globalThis.Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 4,
          envelope: {
            attack: 0.01,
            decay: 0.74,
            sustain: 0.71,
            release: 0.05,
            attackCurve: 'exponential'
          }
        })
        bd.chain(gain, distortion, reverb, compressor)
        return [bd, compressor]
      }
      return membrameSynth
    }.call((MODSELF = {}), edide, MODSELF))
    edide.toneSynth = (function (edide, toneSynth) {
      Object.defineProperty(this, 'module_name', {
        value: 'toneSynth'
      })
      this.startNote = 'C3'
      this.init = () => {
        let ss
        return (ss = new __usable_globalThis.Tone.PolySynth(
          12,
          __usable_globalThis.Tone.Synth,
          {
            oscillator: {
              type: 'sine'
            },
            envelope: {
              attack: 0.005,
              decay: 0.1,
              sustain: 0.3,
              release: 1
            }
          }
        ))
      }
      return toneSynth
    }.call((MODSELF = {}), edide, MODSELF))
    edide.instrumentConfigs = ((edide) => {
      const configs = {
        'bass-electric': {
          startNote: 'C#2',
          notes: 8,
          // 16
          step: 3
        },
        cello: {
          startNote: 'C2',
          notes: 11,
          step: 2,
          skipNotes: edide.set('F#2', 'C4')
        },
        'drum-electric': edide.membrameSynth,
        'guitar-acoustic': {
          startNote: 'D1',
          notes: 26,
          // 36
          step: 2,
          skipNotes: edide.set('E4', 'F#4', 'G#4', 'A#4', 'C5', 'D5', 'E5')
        },
        'guitar-electric': {
          startNote: 'F#2',
          notes: 15,
          // 15
          step: 3
        },
        piano: {
          startNote: 'A1',
          notes: 30,
          // 29
          step: 2,
          baseUrl: 'https://tonejs.github.io/examples/audio/salamander/'
        },
        'synth-simple': edide.toneSynth,
        xylophone: {
          startNote: 'G3',
          notes: ['G3', 'C4', 'G4', 'C5', 'G5', 'C6', 'G6', 'C7']
        }
      }
      for (const inst in configs) {
        configs[inst].name = inst
      }
      return configs
    }).call((MODSELF = {}), edide, MODSELF)
    edide.objectFromArray = (() => {
      const identity = (el) => el
      return (array, valFromEl, keyFromEl) => {
        let el
        let i
        let ind
        let len
        let obj
        if (valFromEl == null) {
          valFromEl = identity
        }
        if (keyFromEl == null) {
          keyFromEl = identity
        }
        obj = {}
        for (ind = i = 0, len = array.length; i < len; ind = ++i) {
          el = array[ind]
          obj[keyFromEl(el, ind)] = valFromEl(el, ind)
        }
        return obj
      }
    }).call((MODSELF = {}), edide, MODSELF)
    edide.noteFreq = (function (edide, noteFreq) {
      Object.defineProperty(this, 'module_name', {
        value: 'noteFreq'
      })
      let a4
      let noteMap
      let notesObj
      this.notes = [
        ['C0', 16.35, 2109.89],
        ['C#0', 17.32, 1991.47],
        ['D0', 18.35, 1879.69],
        ['D#0', 19.45, 1774.2],
        ['E0', 20.6, 1674.62],
        ['F0', 21.83, 1580.63],
        ['F#0', 23.12, 1491.91],
        ['G0', 24.5, 1408.18],
        ['G#0', 25.96, 1329.14],
        ['A0', 27.5, 1254.55],
        ['A#0', 29.14, 1184.13],
        ['B0', 30.87, 1117.67],
        ['C1', 32.7, 1054.94],
        ['C#1', 34.65, 995.73],
        ['D1', 36.71, 939.85],
        ['D#1', 38.89, 887.1],
        ['E1', 41.2, 837.31],
        ['F1', 43.65, 790.31],
        ['F#1', 46.25, 745.96],
        ['G1', 49.0, 704.09],
        ['G#1', 51.91, 664.57],
        ['A1', 55.0, 627.27],
        ['A#1', 58.27, 592.07],
        ['B1', 61.74, 558.84],
        ['C2', 65.41, 527.47],
        ['C#2', 69.3, 497.87],
        ['D2', 73.42, 469.92],
        ['D#2', 77.78, 443.55],
        ['E2', 82.41, 418.65],
        ['F2', 87.31, 395.16],
        ['F#2', 92.5, 372.98],
        ['G2', 98.0, 352.04],
        ['G#2', 103.83, 332.29],
        ['A2', 110.0, 313.64],
        ['A#2', 116.54, 296.03],
        ['B2', 123.47, 279.42],
        ['C3', 130.81, 263.74],
        ['C#3', 138.59, 248.93],
        ['D3', 146.83, 234.96],
        ['D#3', 155.56, 221.77],
        ['E3', 164.81, 209.33],
        ['F3', 174.61, 197.58],
        ['F#3', 185.0, 186.49],
        ['G3', 196.0, 176.02],
        ['G#3', 207.65, 166.14],
        ['A3', 220.0, 156.82],
        ['A#3', 233.08, 148.02],
        ['B3', 246.94, 139.71],
        ['C4', 261.63, 131.87],
        ['C#4', 277.18, 124.47],
        ['D4', 293.66, 117.48],
        ['D#4', 311.13, 110.89],
        ['E4', 329.63, 104.66],
        ['F4', 349.23, 98.79],
        ['F#4', 369.99, 93.24],
        ['G4', 392.0, 88.01],
        ['G#4', 415.3, 83.07],
        ['A4', 440.0, 78.41],
        ['A#4', 466.16, 74.01],
        ['B4', 493.88, 69.85],
        ['C5', 523.25, 65.93],
        ['C#5', 554.37, 62.23],
        ['D5', 587.33, 58.74],
        ['D#5', 622.25, 55.44],
        ['E5', 659.25, 52.33],
        ['F5', 698.46, 49.39],
        ['F#5', 739.99, 46.62],
        ['G5', 783.99, 44.01],
        ['G#5', 830.61, 41.54],
        ['A5', 880.0, 39.2],
        ['A#5', 932.33, 37.0],
        ['B5', 987.77, 34.93],
        ['C6', 1046.5, 32.97],
        ['C#6', 1108.73, 31.12],
        ['D6', 1174.66, 29.37],
        ['D#6', 1244.51, 27.72],
        ['E6', 1318.51, 26.17],
        ['F6', 1396.91, 24.7],
        ['F#6', 1479.98, 23.31],
        ['G6', 1567.98, 22.0],
        ['G#6', 1661.22, 20.77],
        ['A6', 1760.0, 19.6],
        ['A#6', 1864.66, 18.5],
        ['B6', 1975.53, 17.46],
        ['C7', 2093.0, 16.48],
        ['C#7', 2217.46, 15.56],
        ['D7', 2349.32, 14.69],
        ['D#7', 2489.02, 13.86],
        ['E7', 2637.02, 13.08],
        ['F7', 2793.83, 12.35],
        ['F#7', 2959.96, 11.66],
        ['G7', 3135.96, 11.0],
        ['G#7', 3322.44, 10.38],
        ['A7', 3520.0, 9.8],
        ['A#7', 3729.31, 9.25],
        ['B7', 3951.07, 8.73],
        ['C8', 4186.01, 8.24],
        ['C#8', 4434.92, 7.78],
        ['D8', 4698.63, 7.34],
        ['D#8', 4978.03, 6.93],
        ['E8', 5274.04, 6.54],
        ['F8', 5587.65, 6.17],
        ['F#8', 5919.91, 5.83],
        ['G8', 6271.93, 5.5],
        ['G#8', 6644.88, 5.19],
        ['A8', 7040.0, 4.9],
        ['A#8', 7458.62, 4.63],
        ['B8', 7902.13, 4.37]
      ]
      notesObj = null
      noteMap = () => {
        if (notesObj) {
          return notesObj
        }
        return (notesObj = edide.objectFromArray(
          this.notes,
          (val, ind) => [ind, ...val],
          (key) => key[0]
        ))
      }
      this.findNote = (name) => noteMap()[name]
      a4 = this.findNote('A4')
      this.diffToA4 = (name) => {
        const note = this.findNote(name)
        return note[0] - a4[0]
      }
      this.diff = (n1, n2) => this.findNote(n2)[0] - this.findNote(n1)[0]
      return noteFreq
    }.call((MODSELF = {}), edide, MODSELF))
    edide.strRandom = (() => (limit = 20) => (`${__usable_globalThis.mathRandom()}`).slice(
      2,
      Number(limit + 1) + 1 || 9e9
    )).call((MODSELF = {}), edide, MODSELF)
    edide.inEditor = (function (edide, inEditor) {
      Object.defineProperty(this, 'module_name', {
        value: 'inEditor'
      })
      inEditor = inEditor === true || false
      return inEditor
    }.call((MODSELF = {}), edide, MODSELF))
    edide.edideNamespace = (() => 'edide').call((MODSELF = {}), edide, MODSELF)
    edide.edideNs = ((edide) => {
      let base
      let name
      return (base = edide.global)[(name = edide.edideNamespace)] != null
        ? base[name]
        : (base[name] = {})
    }).call((MODSELF = {}), edide, MODSELF)
    edide.editorModule = ((edide, editorModule) => {
      var editorModule = edide.inEditor ? edide.edideNs : null
      return editorModule
    }).call((MODSELF = {}), edide, MODSELF)
    edide.keep = (function (edide, keep) {
      Object.defineProperty(this, 'module_name', {
        value: 'keep'
      })
      var keep = (prop) => prop
      return keep
    }.call((MODSELF = {}), edide, MODSELF))
    edide.logProd = ((edide) => (...args) => {
      let debug
      let ref
      let ref1
      debug =
					(ref = (ref1 = edide.editorModule) != null ? ref1.debug : void 0) !=
					null
					  ? ref
					  : edide.global.debug
      return debug.log(...args)
    }).call((MODSELF = {}), edide, MODSELF)
    edide.onUnload = ((edide) => {
      let ref
      let ref1
      return (ref =
				(ref1 = edide.editorModule) != null ? ref1.unload.add : void 0) != null
        ? ref
        : () => {}
    }).call((MODSELF = {}), edide, MODSELF)
    edide.var = ((edide) => {
      let clearVar
      let currentReact
      let debugging
      let dependees
      let dependsOn
      let inInitCall
      let infinityCheck
      let initSetter
      let loopLimit
      let newVar
      let setLinks
      let setters
      let updateVar
      let values
      values = edide.keep(new Map()) // #edide.keep if clearVar added again..

      setters = edide.keep(new Map()) // varName => setter:func

      dependees = edide.keep(new Map()) // varName => deps:

      setLinks = edide.keep(new Map()) // for reactiveGraph, show setters inside reactive/setter:s

      debugging = false // edide.editorModule?

      new Map() // varName : dependsOn

      inInitCall = false // TODO use dependsOn? instead

      dependsOn = new Set() // remove

      initSetter = (name, setter) => {
        let debugName
        let err
        let ref
        let val
        debugName = (ref = setter.type) != null ? ref : name
        if (setters.get(name) != null) {
          throw Error(`Reactive for '${debugName}' already exists`)
        }
        setters.set(name, setter)
        if (inInitCall) {
          throw Error(
						`can't create reactive setter (for '${debugName}') inside reactive context`
          )
        }
        inInitCall = name
        dependsOn.clear() // TODO clear => new Set
        try {
          val = setter() // TODO: some day add revar and unvar as params; helps with multiple reactives to keep the separated
        } catch (error) {
          err = error
          inInitCall = false
          err.message = `Reactive initialization of '${debugName}' failed: ${err.message}`
          throw err
        }
        dependsOn.forEach((depName) => {
          let deps
          if ((deps = dependees.get(depName)) == null) {
            dependees.set(depName, (deps = new Set()))
          }
          return deps.add(name)
        })
        inInitCall = false
        return val
      }
      loopLimit = 0
      infinityCheck = new Map() // edide.keep

      updateVar = function (name, val) {
        let ref
        let ref1
        let type
        if (arguments.length === 1) {
          // unless val?
          val = setters.get(name)()
          if (debugging && (type = setters.get(name).type)) {
            edide.logProd(`running ${setters.get(name).type}`)
          }
        }
        if (typeof name !== 'string') {
          // symbol ~ react function
          return
        }
        if (values.get(name) === val && typeof val !== 'object') {
          return
        }
        if (infinityCheck.get(name) > loopLimit) {
          infinityCheck.forEach((k) => edide.logProd(k))
          edide.logProd(name)
          if ((ref = edide.editorModule) != null) {
            if (typeof ref.reactiveGraph === 'function') {
              ref.reactiveGraph()
            }
          }
          throw Error('Inifinite loop in :var dependencies')
        }
        if (debugging) {
          edide.logProd(`updating ${name}`)
        }
        values.set(name, val)
        if (!inInitCall) {
          infinityCheck.set(name, (infinityCheck.get(name) || 0) + 1)
          if ((ref1 = dependees.get(name)) != null) {
            ref1.forEach((depName) => updateVar(depName))
          }
          infinityCheck.delete(name)
        }
        return val
      }
      currentReact = []
      newVar = function (name, setter) {
        let context
        let contextSet
        let err
        if (arguments.length === 1) {
          if (typeof name === 'string') {
            if (inInitCall) {
              dependsOn.add(name)
              edide.onUnload(() =>
              // TODO make specific clear?
                clearVar(name))
            }
            return values.get(name)
          } else {
            setter = name
            name = Symbol()
            values.set(name, name) // for debugging (showing react/dom funcs in graph)
            edide.onUnload(() =>
            // TODO make specific clear?
              clearVar(name))
          }
        }
        if (currentReact.length) {
          // and debugging
          context = currentReact[currentReact.length - 1]
          if (!(contextSet = setLinks.get(context))) {
            setLinks.set(context, (contextSet = new Set()))
          }
          contextSet.add(name)
        }
        currentReact.push(name)
        if (values.get(name) == null) {
          edide.onUnload(() => clearVar(name))
        }
        if (typeof setter === 'function') {
          setter = initSetter(name, setter) // setter becomes value
        }
        if (typeof name === 'string') {
          try {
            updateVar(name, setter)
          } catch (error) {
            err = error
            infinityCheck.clear()
            throw err
          }
        }
        currentReact.pop()
        return setter
      }
      clearVar = (name) => {
        let i
        let len
        let map
        let ref
        ref = [values, setters, dependees, setLinks]
        for (i = 0, len = ref.length; i < len; i++) {
          map = ref[i]
          map.delete(name)
        }
      }
      Object.assign(newVar, {
        dependees,
        values,
        setters,
        setLinks
      })
      return newVar
    }).call((MODSELF = {}), edide, MODSELF)
    edide.reactiveWithFilters = ((edide) => (initialVars = {}, filters = {}) => {
      let handler
      let id
      let key
      let react
      let revar
      let todoMap
      let unvar
      let val
      id = edide.strRandom()
      handler = {
        get: (map, prop) => {
          let ref
          if (
            (ref = edide.editorModule) != null
              ? ref.editor_inspector.inspectingNow
              : void 0
          ) {
            __usable_globalThis.debug.log(
              'IN inspector? Find out is it possible to end up here form inside setter'
            )
            return edide.var.values.get(`${id}.${prop}`)
          }
          return edide.var(`${id}.${prop}`)
        },
        set: (map, prop, value) => {
          if (filters[prop] != null && !filters[prop](value)) {
            throw Error(`Illegal reactive (${prop}: ${value})`)
          }
          edide.var(`${id}.${prop}`, value)
          return true // Proxy set must return true if set is successfull; In the future use Reflect.set, which returns true automatically?
        }
      }
      revar = new Proxy((todoMap = new Map()), handler) // NOTE: map is not used yet
      unvar = new Proxy(todoMap, {
        get: (map, prop) => edide.var.values.get(`${id}.${prop}`),
        set: (map, prop, value) => edide.var.values.set(`${id}.${prop}`, value)
      })
      for (key in initialVars) {
        val = initialVars[key]
        revar[key] = val
      }
      react = (nameOrFunc, func) => {
        if (func != null) {
          func.type = nameOrFunc
        } else {
          func = nameOrFunc
          func.type = 'react' // for debugging
        }
        return edide.var(func)
      }
      return {
        react,
        revar,
        unvar,
        un: unvar,
        re: revar // , dom
      }
    }).call((MODSELF = {}), edide, MODSELF)
    edide.mmState = (function (edide, mmState) {
      Object.defineProperty(this, 'module_name', {
        value: 'mmState'
      })
      let filters
      let instruments
      this.defaults = {
        playing: false,
        recorderOn: false,
        fullSheet: '',
        sheet: '',
        // selected/play part of fullSheet
        diffText: '',
        note: null,
        // currently playing note
        // state properties
        pace: 400,
        // -> bpm -> beatDelay
        bpm: 400,
        // deprecate
        beatDelay: (1 / 400) * 60 * 1000,
        // silly! unify with pace as one statestate variable
        balance: 0,
        volume: 0,
        detune: 0,
        blur: 0,
        itch: 0,
        instrumentsLoading: 0,
        // dropdowns
        instrument: 'guitar-electric',
        scale: 'pentatonic',
        root: 'C3',
        highlight: null,
        keyboardInd: 0 // TODO --> keyboard
      }
      instruments = Object.keys(edide.instrumentConfigs)
      filters = {
        scale: (val) => ['pentatonic', 'minor', 'major'].includes(val),
        instrument: (val) => instruments.includes(val),
        root: (val) => edide.noteFreq.findNote(val)
      }
      this.react = null
      this.init = (startingProps = {}) => {
        let props
        if (this.react != null) {
          return this
        }
        props = { ...this.defaults, ...startingProps };
        ({
          react: this.react,
          revar: this.revar,
          unvar: this.unvar
        } = edide.reactiveWithFilters(props, filters))
        return this
      }
      return mmState
    }.call((MODSELF = {}), edide, MODSELF))
    edide.mmEffects = (function (edide, mmEffects) {
      Object.defineProperty(this, 'module_name', {
        value: 'mmEffects'
      });
      ({ revar: this.revar } = edide.mmState.init())
      this.maxLowpass = 10000
      this.maxDistortion = 3
      this.revar.lowpass = () => {
        let blur;
        ({ blur } = this.revar)
        return this.maxLowpass - blur * (this.maxLowpass - 200)
      }
      this.revar.distortion = () => {
        let itch;
        ({ itch } = this.revar)
        return this.maxDistortion * itch
      }
      return mmEffects
    }.call((MODSELF = {}), edide, MODSELF))
    edide.clone = (() => (...objects) => {
      if (Array.isArray(objects[0])) {
        return Object.assign([], ...objects)
      } else {
        return Object.assign({}, ...objects)
      }
    }).call((MODSELF = {}), edide, MODSELF)
    edide.strParsesToNumber = (function (edide, strParsesToNumber) {
      Object.defineProperty(this, 'module_name', {
        value: 'strParsesToNumber'
      })
      var strParsesToNumber = (str) => !Number.isNaN(parseInt(str))
      return strParsesToNumber
    }.call((MODSELF = {}), edide, MODSELF))
    edide.mmConfigs = (function (edide, mmConfigs) {
      Object.defineProperty(this, 'module_name', {
        value: 'mmConfigs'
      })
      let defaultVars
      let mutatingProp
      let mutatingVars
      let stateVars
      let vars
      vars = {} // varName: config object

      mutatingVars = {}
      stateVars = edide.set(
        'itch',
        'blur',
        'instrument',
        'bpm',
        'pace',
        'beatDelay',
        'scale',
        'root',
        'balance',
        'detune',
        'volume'
      )
      this.hasVar = (varName) => {
        let ref
        let ref1
        return Boolean((ref =
					(ref1 = vars[varName]) != null ? ref1 : mutatingVars[varName]) != null
          ? ref
          : stateVars.has(varName))
      }
      this.activateVar = (name, value) => {
        let configs
        if (value != null) {
          configs = stateVars.has(name)
            ? {
                [`${name}`]: value
              }
            : mutatingVars[name] != null
              ? edide.clone(mutatingVars[name])
              : void 0
          if (edide.strParsesToNumber(value)) {
            value = parseFloat(value)
          }
          configs[mutatingProp(configs)] = value
          return this.activate(configs)
        } else {
          return this.activate(vars[name])
        }
      }
      mutatingProp = (configs) => {
        let name
        let val
        for (name in configs) {
          val = configs[name]
          if (val === '*') {
            return name
          }
        }
        return false
      }
      this.activate = (conf) => {
        if (conf.name != null) {
          return // throw warning?
        }
        return Object.assign(edide.mmState.revar, conf)
      }
      this.reset = () => {
        stateVars.forEach(
          (name) => (edide.mmState.revar[name] = edide.mmState.defaults[name])
        )
      }
      this.addVar = (varName, config) => {
        // , activate=true
        if (mutatingProp(config)) {
          return (mutatingVars[varName] = config)
        } else {
          return (vars[varName] = config)
        }
      }
      defaultVars = {
        bass: {
          instrument: 'bass-electric'
        },
        cello: {
          instrument: 'cello'
        },
        guitar: {
          instrument: 'guitar-acoustic'
        },
        eguitar: {
          instrument: 'guitar-electric'
        },
        piano: {
          instrument: 'piano'
        },
        synth: {
          instrument: 'synth-simple'
        },
        xylophone: {
          instrument: 'xylophone'
        },
        pentatonic: {
          scale: 'pentatonic'
        },
        major: {
          scale: 'major'
        },
        minor: {
          scale: 'minor'
        }
      }
      this.init = () => {
        let conf
        let name
        vars = {}
        for (name in defaultVars) {
          conf = defaultVars[name]
          this.addVar(name, conf, false)
        }
      }
      this.init()
      return mmConfigs
    }.call((MODSELF = {}), edide, MODSELF))
    edide.setTimeout = ((edide) => {
      let nativeSetTimeout
      let ref
      nativeSetTimeout = edide.global.nativeSetTimeout =
				(ref = edide.global.nativeSetTimeout) != null
				  ? ref
				  : edide.global.setTimeout
      return (arg1, arg2) => {
        let fun
        let id
        let num;
        [fun, num] = typeof arg2 === 'function' ? [arg2, arg1] : [arg1, arg2]
        id = nativeSetTimeout(fun, num)
        edide.onUnload(() => clearTimeout(id))
        return id
      }
    }).call((MODSELF = {}), edide, MODSELF)
    edide.musicScales = (function (edide, musicScales) {
      Object.defineProperty(this, 'module_name', {
        value: 'musicScales'
      })
      this.full = [
        'C',
        'C#',
        'D',
        'D#',
        'E',
        'F',
        'F#',
        'G',
        'G#',
        'A',
        'A#',
        'B'
      ]
      this.scaleSteps = {
        // rock
        // 0, 3,      2, 2, 3,    (2)
        pentatonic: [
          0,
          3,
          2,
          2,
          3 // hidden 2 # "pentatonicMinor"
        ],
        // pentatonicMajor: ['C, D, E, G, A']
        // blues: minor penta +
        // whole – whole – half – whole – whole – whole – half
        major: [
          0,
          2,
          2,
          1,
          2,
          2,
          2 // hidden to beginning: 1 # "naturalMajor"
        ],
        // whole – half – whole – whole – half – whole – whole
        minor: [
          0,
          2,
          1,
          2,
          2,
          1,
          2 // hidden to beginning: 2 # "naturalMinor"
        ]
      }
      // http://whatmusicreallyis.com/papers/sacred_sounds_scale.html
      this.triadSteps = {
        major: [
          0,
          4,
          3 // positive valence
        ],
        minor: [0, 3, 4]
      }

      // M = major triad
      // m = minor triar
      // i = number of (half) steps from first triad to second
      // (source: https://www.youtube.com/watch?v=YSKAt3pmYBs)
      this.triadCombinations = {
        protagonism: 'M2M',
        outerSpace: 'M6M',
        fantastical: 'M8M',
        sadness: 'M4m',
        romantic: 'M5m',
        // and middle eastern
        wonder: 'm5M',
        // and trancendence
        mystery: 'm2M',
        // and dark comedy
        dramatic: 'm11M',
        antagonismDanger: 'm6m',
        // less character based
        antagonismEvil: 'm8m' // cahracter based
      }
      return musicScales
    }.call((MODSELF = {}), edide, MODSELF))
    edide.mathOp = (function (edide, mathOp) {
      Object.defineProperty(this, 'module_name', {
        value: 'mathOp'
      })
      this.sum = (a, b) => a + b
      this.multiply = (a, b) => a * b
      return mathOp
    }.call((MODSELF = {}), edide, MODSELF))
    edide.mmKeyboard = (function (edide, mmKeyboard) {
      Object.defineProperty(this, 'module_name', {
        value: 'mmKeyboard'
      })
      let A
      let a
      let char
      let chari
      let i
      let j
      let len
      let len1
      let noncaps
      let qwertyChar
      let qwertyRows
      let revar
      let row
      let rowi
      let unvar;
      ({ revar, unvar } = edide.mmState.init())
      revar.scaleSteps = () => edide.musicScales.scaleSteps[revar.scale]
      this.special = {
        rest: '.',
        long: '=',
        comment: '#',
        var: ':',
        confStart: '{',
        confEnd: '}'
      }
      this.specialKeyCodes = new Set(
        Object.values(this.special).map((s) => s.charCodeAt(0))
      )
      this.specialChars = new Set(Object.values(this.special))
      this.isPauseKey = (keyCode) => this.specialKeyCodes.has(keyCode)
      this.isSpecialChar = (char) => this.specialChars.has(char)
      this.isPauseChar = this.isSpecialChar // not really...

      this.keyboards = ['qwerty', 'abc']
      a = 'a'.charCodeAt(0)
      A = 'A'.charCodeAt(0)
      ' '.charCodeAt(0)
      this.isCaps = (key) => A <= key && key < a
      this.capsDiff = a - A
      noncaps = (key) => {
        if (this.isCaps(key)) {
          return key + this.capsDiff
        } else {
          return key
        }
      }
      this.getNoteInd = (key) => {
        let maxInstrumentNoteInd
        let noteBaseInd
        let noteInd
        let notes
        let startNote
        let step;
        ({ startNote, notes, step } = unvar.instrumentConf)
        startNote = unvar.root
        noteBaseInd = edide.noteFreq.findNote(startNote)[0]
        noteInd = this[this.keyboards[unvar.keyboardInd]](
          noncaps(key),
          noteBaseInd
        )
        maxInstrumentNoteInd = noteBaseInd + notes * step
        while (noteInd > maxInstrumentNoteInd) {
          noteInd -= 2 * 12
        }
        return noteInd
      }
      this.abc = (key, baseInd) => {
        let fromLowest
        let noteInd
        let stepsFromClosestOctave
        fromLowest = key - a
        stepsFromClosestOctave = fromLowest % revar.scaleSteps.length
        noteInd = 0
        noteInd += revar.scaleSteps
          .slice(0, Number(stepsFromClosestOctave) + 1 || 9e9)
          .reduce(edide.mathOp.sum)
        noteInd += 12 * Math.floor(fromLowest / revar.scaleSteps.length)
        return baseInd + noteInd
      }
      qwertyRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
      qwertyChar = {}
      for (rowi = i = 0, len = qwertyRows.length; i < len; rowi = ++i) {
        row = qwertyRows[rowi]
        for (chari = j = 0, len1 = row.length; j < len1; chari = ++j) {
          char = row[chari]
          qwertyChar[char.charCodeAt(0)] = [rowi, chari]
        }
      }
      this.qwerty = (key, baseInd) => {
        let charSteps
        let halfSteps
        let noteInd
        let octave
        let rowchar
        if (!(rowchar = qwertyChar[key])) {
          return
        }
        [row, char] = rowchar
        octave =
					qwertyRows.length -
					1 -
					row +
					Math.floor(char / unvar.scaleSteps.length)
        char = char % revar.scaleSteps.length
        charSteps = revar.scaleSteps
          .slice(0, Number(char) + 1 || 9e9)
          .reduce((a, b) => a + b)
        halfSteps = 12 * octave + charSteps
        return (noteInd = baseInd + halfSteps)
      }
      return mmKeyboard
    }.call((MODSELF = {}), edide, MODSELF))
    edide.chars = (function (edide, chars) {
      Object.defineProperty(this, 'module_name', {
        value: 'chars'
      })
      this.space = ' '
      this.nonBreakingSpace = ' '
      this.enter = '\n'
      return chars
    }.call((MODSELF = {}), edide, MODSELF))
    edide.showError = ((edide) => {
      const error = (err) => {
        if (edide.inEditor) {
          return edide.editorModule.editor_error.show(err)
        } else if (
          typeof edide.global.require === 'object' &&
					edide.global[edide.edideNamespace].prodErrorPrinter != null
        ) {
          return edide.global[edide.edideNamespace].prodErrorPrinter.showError(
            err
          )
        } else {
          return __usable_globalThis.debug.error(err)
        }
      }
      return (err) => {
        let err2
        if (err != null ? err.stack : void 0) {
          return error(err) // create error to capture stack trace
        } else {
          try {
            throw Error(err)
          } catch (error1) {
            err2 = error1
            return error(err2)
          }
        }
      }
    }).call((MODSELF = {}), edide, MODSELF)
    edide.mmParserSpecial = (function (edide, mmParserSpecial) {
      Object.defineProperty(this, 'module_name', {
        value: 'mmParserSpecial'
      })
      // parse config { .. } and variable : .. : syntaxes
      this.config = (trackStr, ts = {}) => {
        let endInd
        let err
        let name
        endInd = trackStr.search('}') || trackStr.length
        try {
          ts.conf = JSON.parse(trackStr.slice(0, Number(endInd) + 1 || 9e9))
          if (ts.conf.name != null) {
            ({ name } = ts.conf)
            delete ts.conf.name
            edide.mmConfigs.addVar(name, ts.conf)
          } else {
            edide.mmConfigs.activate(ts.conf) // add variable if exists
          }
        } catch (error) {
          err = error
          ts.skip = true // could be used to show error highlighting in editor
          edide.showError(err) // remove this if error highlighting implemented
        }
        return endInd
      }

      // parse variable from curren track row
      // returns false if parsing fails
      this.var = (track, trackState) => {
        let i
        let value
        let varLength
        let varName
        let varStr;
        ({ i } = trackState)
        varLength = track.slice(i + 1).indexOf(edide.mmKeyboard.special.var)
        if (varLength === -1) {
          return false
        }
        varStr = track.slice(i + 1, Number(i + varLength) + 1 || 9e9);
        [varName, value] = varStr.split(' ')
        if (!edide.mmConfigs.hasVar(varName)) {
          // TODO: with errors shown in UI the following check could be removed:
          return false
        }
        try {
          edide.mmConfigs.activateVar(varName, value)
          trackState.i += varLength + 2
          return true
        } catch (error) {
          // throw err if edide.inEditor
          return false
        }
      }
      return mmParserSpecial
    }.call((MODSELF = {}), edide, MODSELF))
    edide.mmNote = (function (edide, mmNote) {
      Object.defineProperty(this, 'module_name', {
        value: 'mmNote'
      })
      this.fromChar = (char) => this.fromKeyCode(char.charCodeAt(0))
      this.fromKeyCode = (key) => {
        let noteInd
        let ref
        if (typeof (noteInd = edide.mmKeyboard.getNoteInd(key)) === 'number') {
          return (ref = edide.noteFreq.notes[noteInd]) != null
            ? ref[0]
            : void 0
        }
      }
      return mmNote
    }.call((MODSELF = {}), edide, MODSELF))
    edide.mmParser = (function (edide, mmParser) {
      Object.defineProperty(this, 'module_name', {
        value: 'mmParser'
      })
      let getNoteLength
      let nonBreakingSpace
      let processTrack
      let revar
      let space
      let unvar;
      ({ revar, unvar } = edide.mmState)
      getNoteLength = (row, noteInd) => {
        let char
        let length
        length = 1
        while ((char = row[++noteInd])) {
          if (char === edide.mmKeyboard.special.long) {
            length++
          } else {
            break
          }
        }
        return length
      };
      ({ space, nonBreakingSpace } = edide.chars)

      // Processes one char in a track, and iteratively calls itself if needed.
      // ccs - "current column state" - inline chord + played?
      // ts - track state: char index, configs
      processTrack = (track, ccs, ts) => {
        let bef
        let chord
        let groupingChars
        let keyCode
        let lastSpace
        let note
        let repeat
        let repeatStart
        if (!track[ts.i]) {
          return
        }
        if (ts.skip) {
          // comment or erroneous chars
          return
        }
        // bracket chords
        switch (track[ts.i]) {
          case '{':
            return (ts.i += edide.mmParserSpecial.config(
              track.slice(ts.i),
              ts
            ))
            //  parseConfigs
          case '*':
            if (ts.repeat != null) {
              // inside a repeating pattern
              ts.repeat--
              if (ts.repeat > 0) {
                // still repeats left to do, start from the beginning
                ts.i = ts.iStart = ts.repeatStart // repeats done
              } else {
                ts.repeat = ts.repeatStart = null
                ts.i++ // step over '*' so won't end up starting repeats again
              }
            } else {
              if (isNaN((repeat = parseInt(track.slice(ts.i + 1))))) {
                ts.i++ // unable to parse number of repeats, skip them
              } else {
                // initialize new repeating patter (-1 because repeat pattern already played once)
                ts.repeat = repeat - 1
                // search for beginning of repeat group
                bef = track.slice(0, ts.i)
                groupingChars = ['(', space, nonBreakingSpace, '*']
                lastSpace = Math.max(
                  ...groupingChars.map((c) => bef.lastIndexOf(c))
                )
                repeatStart = lastSpace !== -1 ? lastSpace + 1 : 0 // beginning of row if no grouping char found
                // set track state at the beginning of repeats
                ts.i = ts.iStart = ts.repeatStart = repeatStart
              }
            }
            return processTrack(track, ccs, ts)
          case '[':
            ccs.chord = []
            ts.i++
            return processTrack(track, ccs, ts)
          case ']':
            ts.i++;
            ({ chord } = ccs)
            if (!chord) {
              // illegal - missing beginning [
              return processTrack(track, ccs, ts)
            }
            ccs.chord = null
            if (chord.length) {
              if (!unvar.preprocessing) {
                revar.playNote = [chord, getNoteLength(track, ts.i)]
              }
              // edide.mmInstrument.playNote chord, getNoteLength track, ts.i
              ccs.played = true
            } else {
              processTrack(track, ccs, ts)
            }
            return
          case edide.mmKeyboard.special.var:
            if (edide.mmParserSpecial.var(track, ts)) {
              processTrack(track, ccs, ts) // recursive, since next char could be another var, e.g. \:bass::minor:
            } else {
              ts.skip = true // parse error
            }
            return
          case edide.mmKeyboard.special.comment:
            return (ts.skip = true)
        }
        // TODO: merge switch and bottom code OR put them in a different functions
        if (!(keyCode = track.charCodeAt(ts.i))) {
          return
        }
        ts.i++
        if ((note = edide.mmNote.fromKeyCode(keyCode))) {
          if (ccs.chord) {
            ccs.chord.push(note)
            processTrack(track, ccs, ts)
          } else {
            if (!unvar.preprocessing) {
              revar.playNote = [note, getNoteLength(track, ts.i)]
            }
            // edide.mmInstrument.playNote note, getNoteLength track, ts.i
            ccs.played = true
          }
        } else if (edide.mmKeyboard.isPauseKey(keyCode)) {
          ccs.played = true // "play silence"
          // meaningless char
        } else {
          processTrack(track, ccs, ts)
        }
      }

      // TODO figure sheetStart != 0  --  maybe makes more sense to remove textarea first
      this.splitSections = (str) => {
        let i
        let j
        let prevInd
        let ref
        let row
        let section
        let sections
        str = str.replace('&\n', '') // TODO fix row tracking with &\n
        sections = []
        section = null
        row = 0
        prevInd = 0
        for (
          i = j = 0, ref = str.length;
          ref >= 0 ? j <= ref : j >= ref;
          i = ref >= 0 ? ++j : --j
        ) {
          if (!(str[i] === '\n' || i === str.length)) {
            continue
          }
          if (str[i - 1] === '\n') {
            if (section != null) {
              sections.push(section)
            }
            section = null
          }
          if (i > prevInd) {
            if (section == null) {
              section = {
                row,
                tracks: []
              }
            }
            section.tracks.push(str.slice(prevInd, i))
          }
          row++
          prevInd = i + 1
        }
        if (section != null) {
          sections.push(section)
        }
        sections.row = 0
        return sections
      }
      this.play = (song, sectionInd, trackStates) => {
        let ccs
        let section
        if (!unvar.playing) {
          return
        }
        revar.highlight = null
        sectionInd = sectionInd || 0
        if (typeof song === 'string') {
          song = this.splitSections(song)
        }
        section = song[sectionInd]
        if (!section) {
          // song finished
          if (!unvar.preprocessing) {
            revar.playing = false
          }
          return
        }
        if (!Array.isArray(trackStates)) {
          trackStates = section.tracks.map(() => ({
            // initi track indices on first call to section
            i: 0
          }))
        }
        // init @play ccs
        ccs = {} // chord, played  # TODO change back to chord: [C3, D3] and [].played = true
        // OR: why not just ts.chord?
        section.tracks.forEach((track, tInd) => {
          let conf
          let i
          let iStart
          if ((conf = trackStates[tInd].conf)) {
            // config row and already parsed (NOTE: config row can only have one config object and nothing else)
            return edide.mmConfigs.activate(conf)
          } else {
            trackStates[tInd].iStart = trackStates[tInd].i
            processTrack(track, ccs, trackStates[tInd]);
            ({ iStart, i } = trackStates[tInd])
            if (i > iStart) {
              return (revar.highlight = [section.row + tInd, iStart, i - 1])
            }
          }
        })
        if (ccs.played) {
          if (unvar.preprocessing) {
            this.play(song, sectionInd, trackStates)
          } else {
            edide.setTimeout(
              () => this.play(song, sectionInd, trackStates),
              unvar.beatDelay
            )
          }
        } else {
          // using timeout fixes bug where revar.playing is set false in same exec where it's set true (infinite loop)
          this.play(song, sectionInd + 1)
        }
      }
      return mmParser
    }.call((MODSELF = {}), edide, MODSELF))
    edide.moduleGate = (function (edide, moduleGate) {
      Object.defineProperty(this, 'module_name', {
        value: 'moduleGate'
      })
      if (!edide.inEditor) {
        return this
      }
      this.root // module that is edited in root

      this.rootName
      this.active // module that is currently being edited (can be root or in window)

      this.activeName
      this.executing
      this.executingName
      return moduleGate
    }.call((MODSELF = {}), edide, MODSELF))
    edide.rejectIfRecompiled = ((edide) => {
      if (!edide.inEditor) {
        return () => {}
      }
      return (promise) => {
        let recompiled
        let rootName;
        ({ rootName } = edide.moduleGate)
        recompiled = false
        edide.editorModule.editor_events.on(
          'before_recompile',
          () => (recompiled = true)
        )
        return promise.then((arg) => {
          if (recompiled || rootName !== edide.moduleGate.rootName) {
            // root module changed
            return Promise.reject() // quiet rejection; no need to show error
          } else {
            return arg // arg get wrapped in promise
          }
        })
      }
    }).call((MODSELF = {}), edide, MODSELF)
    edide.promise = (function (edide, promise) {
      Object.defineProperty(this, 'module_name', {
        value: 'promise'
      })
      let ref
      edide.global.origPromise =
				(ref = edide.global.origPromise) != null ? ref : edide.global.Promise
      this.new = (cb) => {
        if (edide.inEditor) {
          return edide.rejectIfRecompiled(new Promise(cb)) // don't fire cb if code has been re-executed in the meantime
        } else {
          return new Promise(cb)
        }
      }
      this.all = (cbArray) => {
        if (edide.inEditor) {
          // check that after resolved, still editing same module
          return edide.rejectIfRecompiled(Promise.all(cbArray))
        } else {
          return Promise.all(cbArray)
        }
      }
      this.resolve = Promise.resolve.bind(Promise)
      this.reject = Promise.reject.bind(Promise)
      return promise
    }.call((MODSELF = {}), edide, MODSELF))
    edide.qs = (() => (selector, el = document) => el.querySelector(selector)).call((MODSELF = {}), edide, MODSELF)
    edide.scriptContainer = ((edide) => {
      let createContainer
      let ref
      createContainer = () => {
        const s = document.createElement('div')
        s.id = 'scripts'
        return s
      }
      return (ref = edide.qs('#scripts')) != null
        ? ref
        : document.body.appendChild(createContainer())
    }).call((MODSELF = {}), edide, MODSELF)
    edide.scriptAdd = ((edide) => (src, cb) => {
      const el = document.createElement('script')
      edide.scriptContainer.appendChild(el)
      if (cb) {
        el.onload = cb
      }
      el.type = 'application/javascript'
      el.src = src
    }).call((MODSELF = {}), edide, MODSELF)
    edide.requireScript = ((edide) => {
      let base
      if ((base = edide.global).requireScriptPromises == null) {
        base.requireScriptPromises = new Map()
      }
      return (scriptSrc) => {
        let promise
        if (
          (promise = __usable_globalThis.requireScriptPromises.get(scriptSrc))
        ) {
          return promise
        } else {
          __usable_globalThis.requireScriptPromises.set(
            scriptSrc,
            (promise = edide.promise.new((resolve) => edide.scriptAdd(scriptSrc, resolve)))
          )
          return promise.catch((err) => {
            edide.showError(err)
            return __usable_globalThis.requireScriptPromises.delete(scriptSrc)
          })
        }
      }
    }).call((MODSELF = {}), edide, MODSELF)
    edide.mmPipe = (function (edide, mmPipe) {
      Object.defineProperty(this, 'module_name', {
        value: 'mmPipe'
      })
      let dist
      let lowpass
      let panner
      let react
      let revar
      let reverber
      let unvar;
      ({ revar, unvar, react } = edide.mmState.init())
      dist = lowpass = reverber = panner = null
      this.initPipe = () => {
        lowpass = new __usable_globalThis.Tone.Filter(
          unvar.lowpass,
          'lowpass',
          -12
        )
        dist = new __usable_globalThis.Tone.Distortion(unvar.distortion)
        panner = new __usable_globalThis.Tone.Panner()
        panner.connect(dist)
        dist.connect(lowpass)
        lowpass.toMaster()
        this.output = lowpass
        revar.pipeReady = true
        return edide.onUnload(() => {
          if (dist != null) {
            if (typeof dist.dipose === 'function') {
              dist.dipose()
            }
          }
          if (lowpass != null) {
            if (typeof lowpass.dispose === 'function') {
              lowpass.dispose()
            }
          }
          return panner != null
            ? typeof panner.dispose === 'function'
              ? panner.dispose()
              : void 0
            : void 0
        })
      }
      this.initInstrument = (instrument) => {
        instrument.connect(panner)
        edide.onUnload(() => instrument != null ? instrument.disconnect() : void 0)
        return instrument
      }
      revar.panner = () => revar.balance
      react('panner', () => {
        revar.panner
        return panner != null ? (panner.pan.value = revar.panner) : void 0
      })
      react('pipe distortion', () => {
        let ref
        revar.distortion
        revar.lowpass
        if (dist != null) {
          dist.distortion = revar.distortion
        }
        return lowpass != null
          ? (ref = lowpass.frequency) != null
              ? ref.linearRampTo(revar.lowpass, 0)
              : void 0
          : void 0
      })
      return mmPipe
    }.call((MODSELF = {}), edide, MODSELF))
    edide.mmInstruments = (function (edide, mmInstruments) {
      Object.defineProperty(this, 'module_name', {
        value: 'mmInstruments'
      })
      const { revar, unvar, react } = edide.mmState
      this.initInstrument = async () => {
        await edide.requireScript(
          'https://cdnjs.cloudflare.com/ajax/libs/tone/13.8.9/Tone.js'
        )
        edide.mmPipe.initPipe()
      }
      const instrumentCache = edide.keep({})
      this.createNew = () => {
        const { name } = unvar.instrumentConf
        let instrument
        let endOfPipe
        const instrumentConf = this.instruments[name]
        if (instrumentConf.module_name) {
          const res = instrumentConf.init()
          if (Array.isArray(res)) {
            instrument = res[0]
            endOfPipe = res[1]
          } else {
            instrument = endOfPipe = res
          }
        } else if (instrumentCache[name]) {
          instrument = endOfPipe = instrumentCache[name]
        } else {
          const noteFiles = buildNotes(instrumentConf)
          revar.instrumentsLoading++
          const inst = new __usable_globalThis.Tone.Sampler(noteFiles, {
            // edide.mmInstrumentssAll[name]
            release: 1,
            baseUrl:
							instrumentConf.url ||
							`https://nbrosowsky.github.io/tonejs-instruments/samples/${
								name
							}/`,
            onload: () => revar.instrumentsLoading--
          })
          inst.soundFontInstrument = true
          instrument = endOfPipe = instrumentCache[name] = inst // [inst, inst]
        }
        edide.mmPipe.initInstrument(endOfPipe)
        return instrument
      }
      this.isReady = () => {
        const { current } = this
        return (
          current &&
					(typeof current.loaded === 'undefined' || current.loaded === true)
        )
      }
      /**
			 *
			 * @param root0
			 * @param root0.startNote
			 * @param root0.notes
			 * @param root0.step
			 * @param root0.skipNotes
			 */
      function buildNotes ({ startNote, notes, step, skipNotes }) {
        const [startInd] = edide.noteFreq.findNote(startNote)
        const noteFiles = {}
        if (Array.isArray(notes)) {
          notes.forEach((note) => {
            noteFiles[note] = `${note.replace('#', 's')}.[mp3|ogg]`
          })
        } else {
          for (let i = 0; i < notes * step; i += step) {
            const note = edide.noteFreq.notes[startInd + i][0]
            if (skipNotes && skipNotes.has(note)) continue
            noteFiles[note] = `${note.replace('#', 's')}.[mp3|ogg]`
          }
        }
        return noteFiles
      }
      this.instruments = edide.instrumentConfigs
      this.instrumentList = Object.values(this.instruments)
      react('active instrument config', () => {
        revar.instrumentConf = this.instruments[revar.instrument] // conf
      })
      return mmInstruments
    }.call((MODSELF = {}), edide, MODSELF))
    edide.cloneSibling = (() => (srcObj) => {
      const o = Object.create(Object.getPrototypeOf(srcObj))
      Object.assign(o, srcObj)
      return o
    }).call((MODSELF = {}), edide, MODSELF)
    edide.times = (() => (timesNum, action) => {
      while (timesNum-- > 0) {
        action(timesNum + 1)
      }
    }).call((MODSELF = {}), edide, MODSELF)
    edide.sleep = ((edide, sleep) => {
      var sleep = (ms) => {
        let resolve
        let timeout
        timeout = resolve = null
        return edide.promise.new((res) => {
          resolve = res
          return (timeout = edide.setTimeout(ms, res))
        })
      }
      return sleep
    }).call((MODSELF = {}), edide, MODSELF)
    edide.mmInstrument = (function (edide, mmInstrument) {
      Object.defineProperty(this, 'module_name', {
        value: 'mmInstrument'
      })
      let cloneOrCreateInstrument
      let getInstruments
      let instruments
      let play
      let react
      let revar
      let unvar
      let updateVolAndTune
      instruments = {}; // name: [instrument instances...]

      ({ unvar, revar, react } = edide.mmState)
      revar.bpm = () => revar.pace
      revar.beatDelay = () => (1 / revar.bpm) * 60 * 1000
      react(() => {})
      updateVolAndTune = (inst) => {
        let detune
        let volume;
        ({ volume, detune } = unvar)
        if (detune != null && inst.detune != null) {
          inst.set('detune', detune)
        }
        if (volume != null && inst.volume != null) {
          return inst.set('volume', volume)
        }
      }
      react(() => {
        let inst
        let insts
        let j
        let len
        let name
        revar.volume
        revar.detune
        for (name in instruments) {
          insts = instruments[name]
          for (j = 0, len = insts.length; j < len; j++) {
            inst = insts[j]
            updateVolAndTune(inst)
          }
        }
      })
      react('create first instrument', () => {
        let name
        let ref
        if (
          !(name = (ref = revar.instrumentConf) != null ? ref.name : void 0)
        ) {
          // e.g. illegal instrument name
          return edide.showError(`Unknown instrument: ${unvar.instrument}`)
        }
        if (revar.pipeReady && !instruments[name]) {
          return (instruments[name] = [edide.mmInstruments.createNew()])
        }
      })
      cloneOrCreateInstrument = (name) => {
        var inst = instruments[name][0].soundFontInstrument
          ? ((inst = edide.cloneSibling(instruments[name][0])),
            (inst.isPlaying = false),
            inst)
          : edide.mmInstruments.createNew()
        updateVolAndTune(inst)
        return inst
      }
      getInstruments = (n) => {
        let all
        let free
        let name;
        ({ name } = unvar.instrumentConf)
        all = instruments[name]
        free = all.filter((i) => !i.isPlaying)
        edide.times(n - free.length, () => {
          let inst
          free.push((inst = cloneOrCreateInstrument(name)))
          return all.push(inst)
        })
        return free.slice(0, n)
      }
      this.playChord = (noteLength = 1) => {}
      this.playNote = (chord, noteLength = 1) => {
        let ind
        let inst
        let insts
        let j
        let len
        let ref
        if (!Array.isArray(chord)) {
          chord = [chord]
        }
        ref = insts = getInstruments(chord.length)
        for (ind = j = 0, len = ref.length; j < len; ind = ++j) {
          inst = ref[ind]
          play(inst, chord[ind], noteLength)
        }
      }
      play = async (instrument, note, length) => {
        let err
        instrument.isPlaying = note // true
        try {
          instrument.triggerAttackRelease(
            note,
            (length * unvar.beatDelay) / 1000
          )
        } catch (error) {
          err = error
          err.message = `Error in playing note ${note}, '${unvar.instrumentConf.name}' probably not loaded yet`
          edide.showError(err)
        }
        revar.note = note
        await edide.sleep(unvar.nextDelay)
        return (instrument.isPlaying = false)
      }
      return mmInstrument
    }.call((MODSELF = {}), edide, MODSELF))
    edide.mmPlayer = (function (edide, mmPlayer) {
      Object.defineProperty(this, 'module_name', {
        value: 'mmPlayer'
      })
      let react
      let revar
      let unvar;
      ({ revar, unvar, react } = edide.mmState.init())
      this.play = (str) => {
        revar.sheet = str
        return (revar.playing = true)
      }
      react('play from sheet', () => {
        if (!revar.playing) {
          return
        }
        edide.mmConfigs.init()
        revar.preprocessing = true
        return edide.setTimeout(() => {
          // infinite revar.playing loop
          edide.mmParser.play(unvar.sheet)
          return (revar.preprocessing = 'done')
        })
      })
      react('play notes/chords', () => {
        let chord
        let playNote
        let playing
        let preprocessing
        let time;
        ({ playNote, playing, preprocessing } = revar)
        if (!(playNote && playing && preprocessing === false)) {
          return
        }
        [chord, time] = revar.playNote
        return edide.mmInstrument.playNote(chord, time)
      })
      this.toggle = () => (revar.playing = !unvar.playing)
      revar.instrumentsLoading
      react('play after preprocess', () => {
        let instrumentsLoading
        let preprocessing;
        ({ instrumentsLoading, preprocessing } = revar)
        if (!(preprocessing === 'done' && instrumentsLoading === 0)) {
          return
        }
        unvar.preprocessing = false
        edide.mmConfigs.reset()
        return edide.mmParser.play(unvar.sheet)
      })
      return mmPlayer
    }.call((MODSELF = {}), edide, MODSELF))
    edide.waves = (function (edide, waves) {
      Object.defineProperty(this, 'module_name', {
        value: 'waves'
      })
      edide.global.music = this
      edide.mmEffects
      const { revar, unvar, react } = edide.mmState
      const playQueue = []
      this.play = (str) => {
        if (!unvar.pipeReady) return playQueue.push(str)
        revar.playing = true
        edide.mmPlayer.play(str)
      }
      this.stop = () => (revar.playing = false)
      edide.mmInstruments.initInstrument()
      react(() => {
        if (!revar.pipeReady) return
        edide.mmConfigs.reset()
        this.play(playQueue.join('\n\n')) // JSON.stringify(initialSettings)
      })
      return waves
    }.call((MODSELF = {}), edide, MODSELF))
    edide.wave = ((edide) => {
      const parent = {
        play () {
          edide.waves.play(this.sheet)
          return this
        },
        stop () {
          edide.waves.stop(this.sheet)
          return this
        },
        blur (val) {
          this.sheet = `:blur ${val}:${this.sheet}`
          return this
        },
        itch (val) {
          this.sheet = `:itch ${val}:${this.sheet}`
          return this
        },
        long (val) {
          // note delay in seconds
          this.sheet = `:beatDelay ${val * 1000}:${this.sheet}`
          return this
        },
        pace (val) {
          // note delay in beats per minute
          this.sheet = `:pace ${val}:${this.sheet}`
          return this
        },
        vary (val) {
          this.sheet = `:detune ${val}:${this.sheet}`
          return this
        },
        loud (val) {
          // increase (>0) or decrease (<0) amplitude in decibels
          this.sheet = `:volume ${val}:${this.sheet}`
          return this
        },
        balance (val) {
          this.sheet = `:balance ${val}:${this.sheet}`
          return this
        }
      }
      return (edide.global.wave = (str) => {
        edide.mmConfigs.reset()
        const obj = Object.create(parent)
        obj.sheet = str
        return obj
      })
    }).call((MODSELF = {}), edide, MODSELF)
    edide.global.wave = edide.wave
  })()
}

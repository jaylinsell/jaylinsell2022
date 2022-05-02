export default class EventEmitter {
  constructor() {
      this.callbacks = {}
      this.callbacks.base = {}
  }

  on(_names, callback) {
      // Errors
      if (typeof _names === 'undefined' || _names === '') {
          console.warn('wrong names')
          return false
      }

      if (typeof callback === 'undefined') {
          console.warn('wrong callback')
          return false
      }

      // Resolve names (clears invalid chararacters from the names)
      const names = this.resolveNames(_names)

      // Each name
      names.forEach(_name => {
          // Resolve name
          const { namespace, value } = this.resolveName(_name)

          // Create namespace if not exist
          if(!(this.callbacks[namespace] instanceof Object))
              this.callbacks[namespace] = {}

          // Create callback if not exist
          if(!(this.callbacks[namespace][value] instanceof Array))
              this.callbacks[namespace][value] = []

          // Add callback
          this.callbacks[namespace][value].push(callback)
      })

      return this
  }

  off(_names) {
    // Errors
    if (typeof _names === 'undefined' || _names === '') {
        console.warn('wrong name')
        return false
    }

    // Resolve names
    const names = this.resolveNames(_names)

    // Each name
    names.forEach(_name => {
      // Resolve name
      const { namespace: baseNamespace, value } = this.resolveName(_name)

      // Remove namespace
      if (baseNamespace !== 'base' && value === '') delete this.callbacks[baseNamespace]

      // Remove specific callback in namespace
      else {
        // Default
        if(baseNamespace === 'base') {
          // Try to remove from each namespace
          for (const namespace in this.callbacks) {
            const namespaceIsObject = this.callbacks[ namespace ] instanceof Object
            const namespaceValueIsArray = this.callbacks[ namespace ][ value ] instanceof Array

            if (namespaceIsObject && namespaceValueIsArray) this.deleteNameSpace(namespace, value)
          }
        }

        // Specified namespace
        else if(this.callbacks[ baseNamespace ] instanceof Object && this.callbacks[ baseNamespace ][ value ] instanceof Array) {
          this.deleteNameSpace(baseNamespace, value)
        }
      }
    })

    return this
  }

  trigger(_name, _args) {
    // Errors
    if(typeof _name === 'undefined' || _name === '') {
        console.warn('wrong name')
        return false
    }

    let finalResult = null
    let result = null

    // Default args
    const args = !(_args instanceof Array) ? [] : _args

    // Resolve names (should on have one event)
    let name = this.resolveNames(_name)

    // Resolve name
    name = this.resolveName(name[0])

    const { namespace: baseNameSpace, value } = name

    // Default namespace
    if (baseNameSpace === 'base') {
      // Try to find callback in each namespace
      for (const namespace in this.callbacks) {
        if(this.callbacks[ namespace ] instanceof Object && this.callbacks[ namespace ][ value ] instanceof Array) {
          this.callbacks[ namespace ][ value ].forEach(callback => {
            result = callback.apply(this, args)

            if(typeof finalResult === 'undefined') finalResult = result
          })
        }
      }
    }

    // Specified namespace
    else if(this.callbacks[ name.namespace ] instanceof Object) {
      if(value === '') {
        console.warn('wrong name')
        return this
      }

      this.callbacks[ name.namespace ][ name.value ].forEach(callback => {
        result = callback.apply(this, args)

        if (typeof finalResult === 'undefined') finalResult = result
      })
    }

    return finalResult
  }


  deleteNameSpace(_namespace, _value) {
    delete this.callbacks[ namespace ][ _value ]

    // Remove namespace if empty
    const nameSpaceIsEmpty = Object.keys(this.callbacks[_namespace]).length === 0
    if (nameSpaceIsEmpty) delete this.callbacks[ namespace ]
  }

  resolveNames(_names) {
    let names = _names
    names = names.replace(/[^a-zA-Z0-9 ,/.]/g, '')
    names = names.replace(/[,/]+/g, ' ')
    names = names.split(' ')

    return names
  }

  resolveName(name) {
    const newName = {}
    const parts = name.split('.')

    newName.original  = name
    newName.value     = parts[ 0 ]
    newName.namespace = 'base' // Base namespace

    // Specified namespace
    if(parts.length > 1 && parts[ 1 ] !== '') newName.namespace = parts[ 1 ]

    return newName
  }
}

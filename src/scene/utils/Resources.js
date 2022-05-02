import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import EventEmitter from './EventEmitter'

export default class Resources extends EventEmitter {
  constructor (sources) {
    super()

    this.sources = sources || []

    this.items = []
    this.toLoad = this.sources.length
    this.loaded = 0


    this.setLoaders()
    this.startLoaders()
  }

  setLoaders () {
    this.loaders = {}
    this.loaders.dracoLoader = new DRACOLoader()
    this.loaders.gltfLoader = new GLTFLoader()

    this.loaders.dracoLoader.setDecoderPath('/draco/')
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
  }

  startLoaders () {
    const { gltfLoader } = this.loaders

    for (const source of this.sources) {
      if (source.type === 'gltfModel') {
        gltfLoader.load(source.path, file => this.sourceLoaded(source, file))
      }
    }
  }

  sourceLoaded (source, file) {
    this.items[source.name] = file
    this.loaded++

    if (this.loaded === this.toLoad) this.trigger('ready')
  }
}

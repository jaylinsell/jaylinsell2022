import * as THREE from 'three'
import Debugger from './utils/Debugger'
import Sizes from './utils/Sizes'
import Time from './utils/Time'
import MousePosition from './utils/MousePosition'
import Colors from './utils/Colors'
import Resources from './utils/Resources'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import sources from './sources'

let instance = null

export default class Scene {
  constructor (canvas) {
    /**
     * Instance
     */
    if (instance) return instance
    instance = this

    // for dev purposes only
    window.scene = this

    /**
     * Options
     */
    this.canvas = canvas
    this.debug = new Debugger()
    this.sizes = new Sizes()
    this.colors = new Colors()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()
    this.mousePosition = new MousePosition()

    // sizes resize event
    this.sizes.on('resize', () => {
      this.resize()
    })

    // time tick event
    this.time.on('tick', () => {
      this.update()
    })

    this.light = new THREE.DirectionalLight("#ffffff", 1)
    this.light.position.set(10, 10, 10)
    this.light.castShadow = true

    this.light.shadow.camera.far = 30

    this.scene.add(this.light)
    this.scene.add(this.light.target)
  }

  resize () {
    this.camera.resize()
    this.renderer.resize()
  }

  update () {
    this.camera.update()
    this.world.update()
    this.renderer.update()
  }
}

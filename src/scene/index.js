import * as THREE from 'three'
import Debug from './utils/Debugger'
import Sizes from './utils/Sizes'
import Time from './utils/Time'
import MousePosition from './utils/MousePosition'
import Colors from './utils/Colors'
import Resources from './utils/Resources'
import Camera from './Camera'
import Lights from './Lights'
import Renderer from './Renderer'
import World from './World/World'
import Physics from './World/Physics'
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
    this.debug = new Debug()
    this.sizes = new Sizes()
    this.colors = new Colors()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.lights = new Lights()
    this.renderer = new Renderer()
    this.world = new World()
    this.mousePosition = new MousePosition()
    this.physics = new Physics()

    // sizes resize event
    this.sizes.on('resize', () => {
      this.resize()
    })

    // time tick event
    this.time.on('tick', () => {
      this.update()
    })
  }

  resize () {
    this.camera.resize()
    this.renderer.resize()
  }

  update () {
    this.camera.update()
    this.mousePosition.update()
    this.world.update()
    this.physics.update()
    this.renderer.update()
  }
}

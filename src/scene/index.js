import * as THREE from 'three'
import Debugger from './utils/Debugger'
import Sizes from './utils/Sizes'
import Time from './utils/Time'
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
    this.debugger = new Debugger()
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

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
    this.world.update()
    this.renderer.update()
  }
}
// const scene = new THREE.Scene()

// // camera
// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight
// }

// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
// camera.position.z = 3
// camera.position.x = 1.5
// camera.position.y = 1.5
// scene.add(camera)

// const BoxGeometry = new THREE.BoxGeometry(1, 1, 1)
// const BoxMaterial = new THREE.MeshBasicMaterial({ color: 0x03bbff })
// const BoxMesh = new THREE.Mesh(BoxGeometry, BoxMaterial)
// scene.add(BoxMesh)

// // renderer
// const canvas = document.querySelector('.webgl')
// const renderer = new THREE.WebGLRenderer({ canvas })
// const t = {}

// t.clearColor = '#920058'
// renderer.setSize(sizes.width, sizes.height)
// renderer.setClearColor(t.clearColor)
// renderer.render(scene, camera)

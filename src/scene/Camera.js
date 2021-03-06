import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from '@/scene'

export default class Camera {
  constructor () {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.setInstance()
    this.setOrbitControls()
  }

  setInstance () {
    this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 1000)
    this.instance.position.set(1.2, 0, 4)
    this.scene.add(this.instance)
  }

  resize () {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  setOrbitControls () {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true

    // this.controls.enablePan = false
    // this.controls.enableRotate = false
  }

  update () {
    this.controls.update()
  }
}

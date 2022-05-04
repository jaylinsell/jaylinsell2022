import * as THREE from 'three'
import Experience from '@/scene'

export default class Logo {
  constructor () {
    this.experience = new Experience()

    this.scene = this.experience.scene
    this.resources = this.experience.resources.items
    this.logoTexture = this.resources.logo

    this.debug = this.experience.debug.ui

    this.setLogo()
  }

  setLogo () {
    this.logoGeometry = new THREE.PlaneGeometry(1, 1, 1, 1)
    this.logoMaterial = new THREE.MeshBasicMaterial({
      map: this.logoTexture,
      transparent: true
    })
    this.logoMesh = new THREE.Mesh(this.logoGeometry, this.logoMaterial)
    const options = {}
    options.scale = 2.05

    this.logoMesh.scale.set(options.scale, options.scale, options.scale)
    this.logoMesh.position.set(-1.5, 0.1, -2)
    this.logoMesh.rotation.y = 0.25

    this.debug.add(this.logoMesh.position, 'x').min(-2).max(2).step(0.01)
    this.debug.add(this.logoMesh.position, 'y').min(-2).max(2).step(0.01)
    this.debug.add(this.logoMesh.position, 'z').min(-2).max(2).step(0.01)

    this.debug.add(options, 'scale').min(0).max(20).step(0.01).onChange(() => this.logoMesh.scale.set(options.scale, options.scale, options.scale))

    this.debug.add(this.logoMesh.rotation, 'y').min(-2).max(2).step(0.01).name('rotation')


    this.scene.add(this.logoMesh)
  }
}

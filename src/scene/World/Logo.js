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
    this.setDebug()
  }

  setLogo () {
    // Retrieve the logo texture (object3d since it's an svg)
    this.logoMesh = this.resources.logo

    // Set the options as an object so we can utilise gui debugger
    this.options = {}
    this.options.scale = 0.005
    this.options.positionX = -1.1
    this.options.rotateX = Math.PI
    this.options.rotateY = Math.PI * 1.85

    this.logoMesh.rotation.x = this.options.rotateX
    this.logoMesh.rotation.y = this.options.rotateY
    this.logoMesh.scale.set(this.options.scale, this.options.scale, this.options.scale)

    // Center the geometry
    const position = new THREE.Vector3()
    const box = new THREE.Box3().setFromObject(this.logoMesh)
    const center = box.getCenter(position)

    this.logoMesh.position.x = -center.x + this.options.positionX
    this.logoMesh.position.y = -center.y

    this.scene.add(this.logoMesh)
  }

  setDebug () {
    // Add debuggers
    const logoFolder = this.debug.addFolder('Logo')

    logoFolder.add(this.logoMesh.position, 'x').min(-10).max(10).step(0.01)
    logoFolder.add(this.logoMesh.position, 'y').min(-10).max(10).step(0.01)
    logoFolder.add(this.logoMesh.position, 'z').min(-10).max(10).step(0.01)
    logoFolder.add(this.options, 'scale').min(-1).max(1).step(0.01).onChange(() => this.logoMesh.scale.set(this.options.scale, this.options.scale, this.options.scale))
    logoFolder.add(this.logoMesh.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.01).name('rotate Y')
    logoFolder.add(this.logoMesh.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.01).name('rotate X')
  }
}

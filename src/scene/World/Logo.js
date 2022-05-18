import * as THREE from 'three'
import Experience from '@/scene'

export default class Logo {
  constructor () {
    this.experience = new Experience()

    this.scene = this.experience.scene
    this.resources = this.experience.resources.items
    this.logoTexture = this.resources.logo

    this.debug = this.experience.debug

    if (this.debug.active) {
      this.logoFolder = this.debug.ui.addFolder('Logo')
      this.logoFolder.close()
    }

    this.setLogo()
    this.setDebug()
  }

  setLogo () {
    // Retrieve the logo texture (object3d since it's an svg)
    this.logoMesh = this.resources.logo

    // Set the options as an object so we can utilise gui debugger
    this.options = {}
    this.options.scale = 0.0035
    this.options.positionX = -1
    this.options.rotateX = Math.PI
    this.options.rotateY = Math.PI * 1.85

    this.logoMesh.rotation.x = this.options.rotateX
    this.logoMesh.rotation.y = this.options.rotateY
    this.logoMesh.scale.set(this.options.scale, this.options.scale, this.options.scale)
    this.logoMesh.castShadow = true

    // Center the geometry
    const position = new THREE.Vector3()
    const box = new THREE.Box3().setFromObject(this.logoMesh)
    const center = box.getCenter(position)

    this.logoMesh.position.x = -center.x + this.options.positionX
    this.logoMesh.position.y = -center.y
    this.logoMesh.traverse(child => {
      if (child instanceof THREE.Mesh) child.castShadow = true
    })

    this.scene.add(this.logoMesh)
  }

  setDebug () {
    // Add debuggers
    if (this.debug.active) {
      this.logoFolder.add(this.logoMesh.position, 'x').min(-10).max(10).step(0.01)
      this.logoFolder.add(this.logoMesh.position, 'y').min(-10).max(10).step(0.01)
      this.logoFolder.add(this.logoMesh.position, 'z').min(-10).max(10).step(0.01)
      this.logoFolder.add(this.options, 'scale').min(-1).max(1).step(0.01).onChange(() => this.logoMesh.scale.set(this.options.scale, this.options.scale, this.options.scale))
      this.logoFolder.add(this.logoMesh.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.01).name('rotate Y')
      this.logoFolder.add(this.logoMesh.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.01).name('rotate X')
    }
  }
}

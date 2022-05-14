import * as THREE from 'three'
import Experience from '@/scene'
import EventEmitter from './EventEmitter'

export default class MousePosition extends EventEmitter{
  constructor (_eye) {
    super()

    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera.instance
    this.time = this.experience.time

    // get mouse position in a 2d space, to then get the 3d values
    this.pointer = new THREE.Vector2()
    this.position3D = new THREE.Vector3()
    this.intersect = null

    this.raycaster = new THREE.Raycaster()

    window.addEventListener('mousemove', e => this.set2dMousePosition(e))

    this.setRaycasterTarget()
  }

  set2dMousePosition ({ x, y }) {
    // assign normalised values (-1 to 1)
    this.pointer.x = (x / window.innerWidth) * 2 - 1
    this.pointer.y = - (y / window.innerHeight) * 2 + 1
  }

  setRaycasterTarget() {
    const distance = 2.2
    this.targetGeometry = new THREE.PlaneGeometry()
    this.targetMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' })
    this.targetMesh = new THREE.Mesh(this.targetGeometry, this.targetMaterial)

    this.targetMesh.position.set(0, 0, -distance)
    this.targetMesh.scale.set(100,100,100)
    this.targetMesh.visible = false

    this.camera.add(this.targetMesh)
  }

  update () {
    this.raycaster.setFromCamera(this.pointer, this.camera)

    const intersect = this.raycaster.intersectObject(this.targetMesh)

    if (intersect.length > 0) {
      this.intersect = intersect[0]
      this.position3D = intersect[0].point
      this.trigger('mouseMove')
    }
  }

  destroyListener () {
    window.removeEventListener('mousemove', e => this.set2dMousePosition(e))
  }
}

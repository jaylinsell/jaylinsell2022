import * as THREE from 'three'
import Experience from '@/scene'
import Head from './Head'

export default class Eye {
  constructor () {
    this.experience = new Experience()

    this.head = new Head()
    this.headModel = this.head.headModel
    this.resources = this.experience.resources
    this.time = this.experience.time
    this.debug = this.experience.debug
    this.mousePosition = this.experience.mousePosition

    this.eyeModel = new THREE.Object3D()
    this.eyeModel.position.set(-0.42, 0, 0.8)

    this.setEye()
    this.setPupil()
    this.setDebug()
  }

  setEye () {
    // Set the object
    this.eyeGeometry = new THREE.SphereGeometry(1, 24, 24)
    this.eyeMaterial = new THREE.MeshMatcapMaterial({ matcap: this.resources.items.matCap34 })
    this.eyeMesh = new THREE.Mesh(this.eyeGeometry, this.eyeMaterial)
    this.eyeMesh.scale.set(0.325, 0.325, 0.325)

    this.eyeModel.add(this.eyeMesh)

    // animate the eye
    const previousPosition = {
      x: 0,
      y: 0
    }

    this.time.on('tick', () => {
      const { x, y } = this.mousePosition
      const positionHasChanged = previousPosition.x !== x || previousPosition.y !== y

      if (positionHasChanged) {
        // Reduce the distance the eye  moves for added realism
        this.eyeModel.rotation.x = -Math.atan((y + this.eyeModel.position.y) / 1.25)
        this.eyeModel.rotation.y = Math.atan((x + this.eyeModel.position.x) / 1.25)

       // updated the previous position with the current ones
        previousPosition.x = x
        previousPosition.y = y
      }
    })
  }

  setPupil () {
    this.pupilGeometry = new THREE.SphereGeometry(0.08, 8, 8)
    this.pupilMaterial = new THREE.MeshBasicMaterial({ color: '#000000' })
    this.pupilMesh = new THREE.Mesh(this.pupilGeometry, this.pupilMaterial)

    this.pupilMesh.scale.z = 0.4
    this.pupilMesh.position.z = 0.31

    this.eyeModel.add(this.pupilMesh)
  }

  setIris () {
    // Unsure if adding Iris yet...
  }

  setDebug () {
    if (this.debug) {
      // no debuggers yet...
      // const debugFolder = this.debug.ui.addFolder('Eye')

    }
  }
}

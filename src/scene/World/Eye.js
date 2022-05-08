import * as THREE from 'three'
import Experience from '@/scene'
import Head from './Head'

export default class Eye {
  constructor () {
    this.experience = new Experience()

    this.head = new Head()
    this.headModel = this.head.headModel
    this.resources = this.experience.resources
    this.camera = this.experience.camera.instance
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.debug = this.experience.debug
    this.mousePosition = this.experience.mousePosition

    this.eyeModel = new THREE.Object3D()
    this.eyeModel.position.set(-0.42, 0, 0.8)

    this.setEye()
    this.setPupil()
    this.setEyeMovement()
    this.setDebug()
  }


  setPupil () {
    this.pupilGeometry = new THREE.SphereGeometry(0.08, 8, 8)
    this.pupilMaterial = new THREE.MeshBasicMaterial({ color: '#000000' })
    this.pupilMesh = new THREE.Mesh(this.pupilGeometry, this.pupilMaterial)

    this.pupilMesh.scale.z = 0.4
    this.pupilMesh.position.z = 0.31

    this.eyeModel.add(this.pupilMesh)
  }

  setEye () {
    // Set the object
    this.eyeGeometry = new THREE.SphereGeometry(1, 24, 24)
    this.eyeMaterial = new THREE.MeshMatcapMaterial({ matcap: this.resources.items.matCap34 })
    this.eyeMesh = new THREE.Mesh(this.eyeGeometry, this.eyeMaterial)
    this.eyeMesh.scale.set(0.325, 0.325, 0.325)

    this.eyeModel.add(this.eyeMesh)
  }

  setIris () {
    // Unsure if adding Iris yet...
  }

  setEyeMovement () {
    // animate the eye
    const previousPosition = {
      x: 0,
      y: 0
    }

    this.mousePosition.on('mouseMove', () => {
      let { x, y, z } = this.mousePosition.position3D
      // const { distance } = this.mousePosition.intersect
      const positionHasChanged = previousPosition.x !== x || previousPosition.y !== y

      // TODO - curve eye on a curved graph based on distance

      if (positionHasChanged) {
        this.eyeModel.lookAt(x, y, z)

        previousPosition.x = x
        previousPosition.y = y
      }
    })
  }

  setDebug () {
    if (this.debug.active) {
      const debugFolder = this.debug.ui.addFolder('Eye')
      debugFolder.add(this.eyeModel.rotation, 'x').min(-Math.PI).max(Math.PI)
      debugFolder.add(this.eyeModel.rotation, 'y').min(-Math.PI).max(Math.PI)
      debugFolder.add(this.eyeModel.rotation, 'z').min(-Math.PI).max(Math.PI)
    }
  }
}


import * as THREE from 'three'
import Experience from '@/scene'

export default class Floor {
  constructor (_options) {
    this.experience = new Experience()
    this.scene = this.experience.scene

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry () {
    this.geometry = new THREE.PlaneGeometry(50, 50, 10, 10)
  }

  setMaterial () {
    this.material = new THREE.MeshBasicMaterial({ color: this.experience.colors.backgroundLight })
  }

  setMesh () {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI * 0.5
    this.mesh.position.y = - 2
    this.mesh.receiveShadow = true

    this.scene.add(this.mesh)
  }
}

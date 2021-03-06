
import * as THREE from 'three'
import Experience from '@/scene'

export default class Floor {
  constructor () {
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
    this.material = new THREE.MeshStandardMaterial({ color: this.experience.colors.backgroundDark })
  }

  setMesh () {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI * 0.5
    this.mesh.position.y = - 1.4
    this.mesh.receiveShadow = true

    this.scene.add(this.mesh)
  }
}

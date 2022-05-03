
import * as THREE from 'three'
import Experience from '@/scene'

export default class Floor {
  constructor (_options) {
    this.experience = new Experience()
    this.scene = this.experience.scene

    this.container = new THREE.Object3d()
    this.container.matrixAutoUpdate = false

    this.setGeometry()
    this.setColors()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry () {
    this.geometry = new THREE.PlaneGeometry(2, 2, 10, 10)
  }

  setColors () {
    this.colors = {}
    this.colors.topLeft = '#ff0000'
    this.colors.topRight = '#00ff00'
    this.colors.bottomLeft = '#0000ff'
    this.colors.bottomRight = '#000000'
  }

  setMaterial () {
    this.material = new FloorMaterial()

    const topLeft = new THREE.Color(this.colors.topLeft)
    const topRight = new THREE.Color(this.colors.topRight)
    const bottomLeft = new THREE.Color(this.colors.bottomLeft)
    const bottomRight = new THREE.Color(this.colors.bottomRight)

    const colorData = new Uint8Array([
      Math.round(bottomLeft.r * 255), Math.round(bottomLeft.g * 255), Math.round(bottomLeft.b * 255),
      Math.round(bottomRight.r * 255), Math.round(bottomRight.g * 255), Math.round(bottomRight.b * 255),
      Math.round(topLeft.r * 255), Math.round(topLeft.g * 255), Math.round(topLeft.b * 255),
      Math.round(topRight.r * 255), Math.round(topRight.g * 255), Math.round(topRight.b * 255)
    ])

    // data, width, height, format...
    this.bgTexture = new THREE.DataTexture(colorData, 2, 2, THREE.RGBFormat)
    this.bgTexture.magFilter = THREE.LinearFilter
    this.bgTexture.needsUpdate = true

    this.material.uniforms.uBackground.value = this.bgTexture
  }

  setMesh () {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI * 0.5
    this.mesh.receiveShadow = true

    this.scene.add(this.mesh)
  }
}

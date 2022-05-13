import * as THREE from 'three'
import Experience from '@/scene'

export default class Lights {
  constructor () {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.debug = this.experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Lights')
    }

    this.setDirectionalLight()
    this.setPurpleLight()
    this.setAmbientLight()
  }

  setDirectionalLight() {
    this.light = new THREE.DirectionalLight("", 0.4)
    this.light.position.set(-30, 50, 50)

    // shadows
    this.light.castShadow = true
    this.light.shadow.mapSize.width = 1024
    this.light.shadow.mapSize.height = 1024
    this.light.shadow.normalBias = 0.08
    this.light.shadow.camera.far = 1000

    this.scene.add(this.light)
    this.scene.add(this.light.target)
  }

  setPurpleLight () {
    this.purpleLight = new THREE.PointLight('#F34DFF', 8, 100)
    this.purpleLight.position.set(1, 1.5, 4.5)

    // Shadows (unsure if I want them active as yet)
    // this.purpleLight.castShadow = true
    // this.purpleLight.shadow.mapSize.width = 1024
    // this.purpleLight.shadow.mapSize.height = 1024
    // this.purpleLight.shadow.normalBias = 0.08
    this.scene.add(this.purpleLight)
  }

  setAmbientLight () {
    this.blueLight = new THREE.PointLight('#60A2A8', 1.6, 100)
    this.blueLight.position.set(7, 1.5, 5)

    // shadows
    this.blueLight.castShadow = true
    this.blueLight.shadow.mapSize.width = 1024
    this.blueLight.shadow.mapSize.height = 1024
    this.blueLight.shadow.normalBias = 0.08
    this.scene.add(this.blueLight)
  }

  setDebug () {
    if (this.debug.active) {
      // directional lights
      this.debugFolder.add(this.light, 'intensity').min(0).max(100).step(0.1).name('light intensity')
      this.debugFolder.add(this.light.position, 'x').min(-50).max(50).step(0.1).name('lightX')
      this.debugFolder.add(this.light.position, 'y').min(-50).max(50).step(0.1).name('lightY')
      this.debugFolder.add(this.light.position, 'z').min(-50).max(50).step(0.1).name('lightZ')


      // point lights
      this.debugFolder.add(this.blueLight, 'intensity').min(0).max(10).step(0.1).name('blue light intensity')
      this.debugFolder.add(this.blueLight.position, 'x').min(-20).max(20).step(0.1).name('blueLightX')
      this.debugFolder.add(this.blueLight.position, 'y').min(-20).max(20).step(0.1).name('blueLightY')
      this.debugFolder.add(this.blueLight.position, 'z').min(-20).max(20).step(0.1).name('blueLightZ')

      this.debugFolder.add(this.purpleLight, 'intensity').min(0).max(10).step(0.1).name('purple light intensity')
      this.debugFolder.add(this.purpleLight.position, 'x').min(-20).max(20).step(0.1).name('purpleLightX')
      this.debugFolder.add(this.purpleLight.position, 'y').min(-20).max(20).step(0.1).name('purpleLightY')
      this.debugFolder.add(this.purpleLight.position, 'z').min(-20).max(20).step(0.1).name('purpleLightZ')
    }
  }
}

import * as THREE from 'three'
import Experience from '@/scene'

export default class Renderer {
  constructor () {
    this.experience = new Experience()
    this.debug = this.experience.debug.ui
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.camera = this.experience.camera

    this.setInstance()
    this.setDebug()
  }

  setInstance () {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })

    this.instance.physicallyCorrectLights = true
    this.instance.outputEncoding = THREE.sRGBEncoding
    // this.instance.toneMapping = THREE.CineonToneMapping
    this.instance.toneMappingExposure = 1.75
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap

    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setClearColor(this.experience.colors.backgroundDark)
  }

  resize () {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  update () {
    this.instance.render(this.scene, this.camera.instance)
  }

  setDebug () {
    if (this.debug.active) {
      const sceneFolder = this.debug.ui.addFolder('Scene')
      sceneFolder.addColor(this.experience.colors, 'backgroundDark')
        .onChange(() => this.instance.setClearColor(this.experience.colors.backgroundDark))
    }
  }
}

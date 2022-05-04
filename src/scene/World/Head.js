import * as THREE from 'three'
import Experience from '@/scene'
import Eye from './Eye'

let instance = null

export default class Head {
  constructor () {
    if (instance) return instance
    instance = this

    this.experience = new Experience()

    const { scene, resources, time, debug } = this.experience

    this.headModel = new THREE.Object3D()
    this.scene = scene
    this.resources = resources
    this.time = time
    this.debug = debug
    this.resource = this.resources.items.shrunkenHead
    this.matCaps = {}

    this.setTextures()
    this.setModel()
    this.setEye()
    this.setDebug()
  }

  setTextures () {
    this.matCaps.headMatCap = 'matCap25'
    this.matCaps.stringMatCap = 'matCap27'
    this.matCaps.boneMatCap = 'matCap30'
    this.matCaps.eyeMatCap = 'matCap34'
    this.matCaps.hairMatCap = 'matCap37'
    this.matCaps.stretcherMatCap = 'matCap39'

    this.matCapReferences = {
      head: 'headMatCap',
      stitch: 'stringMatCap',
      bone: 'boneMatCap',
      eye: 'eyeMatCap',
      hair: 'hairMatCap',
      stretcher: 'stretcherMatCap',
    }
  }

  setModel () {
    // Set the head model group
    this.headModel.position.x = 2
    this.headModel.rotation.y = -Math.PI * 0.05
    this.scene.add(this.headModel)

    // set the blender model
    this.model = this.resource.scene
    this.model.rotation.y = Math.PI

    // For each 'object' type, we apply the corresponding matcap, ie stiches, bones, etc
    this.model.traverse(child => {
      Object.keys(this.matCapReferences).forEach(key => {
        const correspondingMatcap = this.matCaps[this.matCapReferences[key]]

        if (child.name.includes(key)) {
          child.material = new THREE.MeshMatcapMaterial({ matcap: this.resources.items[correspondingMatcap]})
          child.material.needsUpdate = true
        }
      })
    })

    this.headModel.add(this.model)
  }

  setEye () {
    this.eye = new Eye()
    this.headModel.add(this.eye.eyeModel)
  }

  setDebug () {
    if (this.debug) {
      const debugFolder = this.debug.ui.addFolder('Head')
      const matcapFolder = debugFolder.addFolder('matcaps')

      // matCaps
      const matcapResources = [...new Array(44)].map((cap, ind) => `matCap${ind}`)

      // For each item type modelled, we want to add a matcap selector and update the corresponding values in the ui
      Object.keys(this.matCapReferences).forEach(key => {
        matcapFolder.add(this.matCaps, this.matCapReferences[key], matcapResources)
        .onChange(() => {
          this.model.traverse(child => {
            if (child.name.includes(key)) {
              const correspondingMatcap = this.matCaps[ this.matCapReferences[key] ]

              child.material.matcap = this.resources.items[ correspondingMatcap ]
              child.material.needsUpdate = true
            }
          })
        })
      })

    }
  } // end debug
}

import * as THREE from 'three'
import Experience from '@/scene'

export default class Head {
  constructor () {
    this.experience = new Experience()

    const { scene, resources, time, debug } = this.experience

    this.scene = scene
    this.resources = resources
    this.time = time
    this.debug = debug
    this.resource = this.resources.items.shrunkenHead
    this.matCaps = {}

    this.setTextures()
    this.setModel()
    this.setDebug()
  }

  setTextures () {
    this.matCaps.headMatCap = 'matCap25'
    this.matCaps.stringMatCap = 'matCap27'
    this.matCaps.boneMatCap = 'matCap26'

    this.matCapReferences = {
      head: 'headMatCap',
      stitch: 'stringMatCap',
      bone: 'boneMatCap',
    }
  }

  setModel () {
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

    this.scene.add(this.model)
  }

  setDebug () {
    if (this.debug) {
      this.debugFolder = this.debug.ui.addFolder('Head')

      // matCaps
      const matcapResources = [...new Array(37)].map((cap, ind) => `matCap${ind}`)

      // For each item type modelled, we want to add a matcap selector and update the corresponding values in the ui
      Object.keys(this.matCapReferences).forEach(key => {
        this.debugFolder.add(this.matCaps, this.matCapReferences[key], matcapResources)
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

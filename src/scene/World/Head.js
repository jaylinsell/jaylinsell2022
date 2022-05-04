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
    this.setMorphTargets()
    this.setDebug()
  }

  setTextures () {
    this.matCaps.headMatCap = 'matCap25'
    this.matCaps.stringMatCap = 'matCap27'
    this.matCaps.boneMatCap = 'matCap30'
    this.matCaps.eyeMatCap = 'matCap34'
    this.matCaps.hairMatCap = 'matCap37'
    this.matCaps.stretcherMatCap = 'matCap39'
    this.matCaps.toothMatCap = 'matCap30'

    this.matCapReferences = {
      head: 'headMatCap',
      stitch: 'stringMatCap',
      bone: 'boneMatCap',
      eye: 'eyeMatCap',
      hair: 'hairMatCap',
      stretcher: 'stretcherMatCap',
      tooth: 'toothMatCap',
    }
  }

  setModel () {
    // Set the head model group
    this.headModel.position.x = 2
    this.headModel.rotation.y = -Math.PI * 0.05
    this.headModel.castShadow = true
    this.scene.add(this.headModel)

    // set the blender model
    this.model = this.resource.scene
    this.model.rotation.y = Math.PI

    // store the actual child instance of the 'head' item from blender so we can update morph targets
    this.headMesh = this.model.getObjectByName('head')


    // For each 'object' type, we apply the corresponding matcap, ie stiches, bones, etc
    this.model.traverse(child => {
      Object.keys(this.matCapReferences).forEach(key => {
        const correspondingMatcap = this.matCaps[this.matCapReferences[key]]

        if (child.name.includes(key)) {
          child.material = new THREE.MeshMatcapMaterial({ matcap: this.resources.items[correspondingMatcap]})
          child.material.needsUpdate = true

          // TODO Validate the performance of this. Might bake the textures and mock the shadows instead
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    })

    this.headModel.add(this.model)
  }

  setEye () {
    this.eye = new Eye()
    this.headModel.add(this.eye.eyeModel)
  }

  setMorphTargets () {
    const {
      moveHitRight,
      moveLeftEyebrow,
      moveMouth,
      moveRightEyebrowAngry,
      moveSad
    } = this.headMesh.morphTargetDictionary

    this.headMesh.morphTargetInfluences[moveMouth] = 0
    this.headMesh.morphTargetInfluences[moveLeftEyebrow] = 0
  }

  setDebug () {
    if (this.debug) {
      const debugFolder = this.debug.ui.addFolder('Head')
      const matcapFolder = debugFolder.addFolder('matcaps')
      const expressionsFolder = debugFolder.addFolder('expressions')

      // matCaps
      matcapFolder.close() // close folder by default
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

      // Add morph targets / facial expressions
      Object.keys(this.headMesh.morphTargetDictionary).forEach(key => {
        expressionsFolder
          .add(this.headMesh.morphTargetInfluences, this.headMesh.morphTargetDictionary[key])
          .min(0)
          .max(1)
          .name(key)
      })

    }
  } // end debug
}

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

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Head')
      // this.matcapFolder = this.debugFolder.addFolder('matcaps')
      this.expressionsFolder = this.debugFolder.addFolder('expressions')

      // close folders by default
      this.debugFolder.close()
      // this.matcapFolder.close()
      this.expressionsFolder.close()
    }

    this.setTextures()
    this.setModel()
    this.setEye()
    this.setMorphTargets()
    this.setDebug()
  }

  setTextures () {
    // this.matCaps.headMatCap = 'headTexture'
    this.matCaps.stringMatCap = 'matCap27'
    this.matCaps.boneMatCap = 'matCap30'
    this.matCaps.eyeMatCap = 'matCap34'
    this.matCaps.hairMatCap = 'matCap37'
    this.matCaps.stretcherMatCap = 'matCap39'
    this.matCaps.toothMatCap = 'matCap30'

    this.matCapReferences = {
      head: 'headMatCap',
      stitch: 'stringMatCap',
      string: 'stringMatCap',
      bone: 'boneMatCap',
      eye: 'eyeMatCap',
      hair: 'hairMatCap',
      stretcher: 'stretcherMatCap',
      tooth: 'toothMatCap',
    }
  }

  setModel () {
    // Set the head model group
    this.headModel.position.x = 1
    this.headModel.rotation.y = -Math.PI * 0.05
    this.headModel.castShadow = true
    this.scene.add(this.headModel)

    // set the blender model
    this.model = this.resource.scene
    this.model.rotation.y = Math.PI * 0.97
    this.model.scale.set(0.5, 0.5, 0.5)

    // store the actual child instance of the 'head' item from blender so we can update morph targets
    this.headMesh = this.model.getObjectByName('head')


    // For each 'object' type, we apply the corresponding matcap, ie stiches, bones, etc
    this.model.traverse(child => {
      Object.keys(this.matCapReferences).forEach(key => {
        const correspondingMatcap = this.matCaps[this.matCapReferences[key]]

        if (child.name.includes(key)) {
          // child.material = new THREE.MeshMatcapMaterial({ matcap: this.resources.items[correspondingMatcap]})
          // child.material.needsUpdate = true

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
    if (this.debug.active) {
      // matCaps
      // const matcapResources = [...new Array(44)].map((cap, ind) => `matCap${ind}`)

      // For each item type modelled, we want to add a matcap selector and update the corresponding values in the ui
      // Object.keys(this.matCapReferences).forEach(key => {
      //   this.matcapFolder.add(this.matCaps, this.matCapReferences[key], matcapResources)
      //   .onChange(() => {
      //     this.model.traverse(child => {
      //       if (child.name.includes(key)) {
      //         const correspondingMatcap = this.matCaps[ this.matCapReferences[key] ]

      //         child.material.matcap = this.resources.items[ correspondingMatcap ]
      //         child.material.needsUpdate = true
      //       }
      //     })
      //   })
      // })

      // Add morph targets / facial expressions
      Object.keys(this.headMesh.morphTargetDictionary).forEach(key => {
        this.expressionsFolder
          .add(this.headMesh.morphTargetInfluences, this.headMesh.morphTargetDictionary[key])
          .min(0)
          .max(1)
          .name(key)
      })

    }
  } // end debug
}

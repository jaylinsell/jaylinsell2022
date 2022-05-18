import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import Experience from '@/scene'

export default class Physics {
  constructor () {
    // Setup
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.resources = this.experience.resources
    this.camera = this.experience.camera.instance
    this.mousePosition = this.experience.mousePosition

    // World
    this.world = new CANNON.World()
    this.world.broadphase = new CANNON.SAPBroadphase(this.world)
    // this.world.allowSleep = true
    this.world.solver.iterations = 5
    this.world.gravity.set(0, -9.82, 0) // -9.82 being equal to earth gravity

    this.ready = false

    // Debugger
    this.debug = this.experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Physics')

      const obj = {
        togglePhysicWireframes: true
      }

      const meshes = []
      this.cannonDebugger = new CannonDebugger(this.scene, this.world, {
        onInit(body, mesh) {
          meshes.push(mesh)
          toggle.onChange(bool => {
            meshes.forEach(_mesh => bool ? _mesh.visible = true : _mesh.visible = false)

          })
        },
        color: '#03bbff'
      })
      const toggle = this.debugFolder.add(obj, 'togglePhysicWireframes').name('Toggle Physics Wireframes')
    }

    /**
     * Load models & utilities when ready
     */
    this.resources.on('ready', () => {
      this.head = this.experience.world.head.headModel

      this.setPhysicMaterials()
      this.setFloor()
      this.setHeadShape()
      this.setPointToPointConstraints()
      this.setThongWeapon()
      this.setCollisionListeners()
      this.setDebug()

      this.ready = true
    })
  } // end constructor

  setPhysicMaterials () {
    this.concreteMaterial = new CANNON.Material('concrete')
    this.headMaterial = new CANNON.Material('head')
    this.rubberMaterial = new CANNON.Material('rubber')

    const concreteHeadContactMaterial = new CANNON.ContactMaterial(
      this.concreteMaterial,
      this.headMaterial,
      {
        friction: 0.1,
        restitution: 0.4,
      }
    )

    const rubberHeadContactMaterial = new CANNON.ContactMaterial(
      this.rubberMaterial,
      this.headMaterial,
      {
        friction: 0.3,
        restitution: 1,
      }
    )

    this.world.addContactMaterial(concreteHeadContactMaterial)
  }

  setFloor() {
    this.floorShape = new CANNON.Plane()
    this.floorBody = new CANNON.Body()

    this.floorBody.mass = 0
    this.floorBody.material = this.concreteMaterial
    this.floorBody.addShape(this.floorShape)

    this.floorBody.position.set(0, -2, 0)
    this.floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)

    this.world.addBody(this.floorBody)
  }

  createBall () {
    const shape = new CANNON.Sphere(0.4)
    const body = new CANNON.Body({ mass: 10, shape })
    body.position.set(0.45, 2, 0.02)

    this.world.addBody(body)
  }

  setHeadShape () {
    /**
     * The simplest and most performant way of creating a relative shape to the head is by creating
     * compound shapes - where I creeate smaller shapes and position them accoridng to the head, rather than
     * trying to do trimesh or convex shapes.
     */

    const obj = {
      createBall: () => this.createBall()
    }
    // Debug
    if (this.debug.active) {
      this.debugFolder.add(obj, 'createBall')
    }

    // Shape setups for cylinders (used around hair)
    this.cylinderRadius = 0.05
    this.cylinderRadiusBottom = 0.05
    this.cylinderHeight = 0.5
    this.cylinderNumSegements = 8

    // Set Shapes
    const baseSkullShape = new CANNON.Sphere(0.55)
    const chinShape = new CANNON.Sphere(0.33)
    const eyeShape = new CANNON.Box(new CANNON.Vec3(0.45, 0.35, 0.1))
    const hairShape = new CANNON.Cylinder(this.cylinderRadius, 0.5, this.cylinderHeight, this.cylinderNumSegements)

    // Actual body/group
    this.headBody = new CANNON.Body({
      mass: 2,
      position: new CANNON.Vec3(...this.head.position),
    })

    // damping is the easing back to 0 movement after collision
    this.headBody.linearDamping = 0.5
    this.headBody.angularDamping = 0.8

    // Apply shapes
    this.headBody.addShape(baseSkullShape)
    this.headBody.addShape(chinShape, new CANNON.Vec3(-0.05, -0.45, 0.25))
    this.headBody.addShape(eyeShape, new CANNON.Vec3(-0.05, -0.1, 0.4))
    this.headBody.addShape(hairShape, new CANNON.Vec3(0, 0.6, 0))

    // Physics Material
    this.headBody.material = this.headMaterial

    this.world.addBody(this.headBody)
  }

  setPointToPointConstraints () {
    // Create the swing point for the head
    this.swingPoint = new CANNON.Cylinder(this.cylinderRadius, this.cylinderRadiusBottom, this.cylinderHeight, this.cylinderNumSegements)
    this.swingBody = new CANNON.Body({
      mass: 0, // mass 0 to prevent it from moving
      shape: this.swingPoint
    })

    this.swingBody.position.set(1, 1.25, 0.02)

    this.world.addBody(this.swingBody)

    // add constraints
    this.constraint = new CANNON.PointToPointConstraint(
      this.headBody,
      new CANNON.Vec3(0, 0.95, 0), // localPivot for headbody
      this.swingBody,
      new CANNON.Vec3(0, -0.30, 0) // localPivot for swingbody
    )

    // this.constraint.collideConnected = false
    this.world.addConstraint(this.constraint)
  }

  setThongWeapon () {
    // Set physic body
    const shape = new CANNON.Box(new CANNON.Vec3(0.1, 0.5, 1))
    this.thongBody = new CANNON.Body({ mass: 0, shape })
    this.thongBody.material = this.rubberMaterial

    // base position
    this.thongBody.position.set(0, 0, 1)

    console.log(this.mousePosition)


    this.world.addBody(this.thongBody)
  }

  setCollisionListeners () {
    this.headBody.addEventListener('collide', event => {
      this.headBody.collisionResponse = 0
      const relativeVelocity = event.contact.getImpactVelocityAlongNormal()
      console.log({ relativeVelocity })
      if(Math.abs(relativeVelocity) > 0.75) {
        console.log('hard')
      } else {
        console.log('soft')
      }

      // TODO detect when collision "stops", ie the use has moved the thong away from the head
      // Possibly show a loader / countdown timer to rehit
      setTimeout(() => {
        this.headBody.collisionResponse = 1
      }, 1000)
    })
  }

  setDebug () {
    if (this.debug.active) {
      // headDebugger
      this.debugFolder.add(this.headBody, 'linearDamping').min(-1).max(1)
      this.debugFolder.add(this.headBody, 'angularDamping').min(-1).max(1)
    }
  }

  update () {
    this.world.step(1 / 60, this.time.delta, 3)

    if (this.ready) {
      // Update head position
      this.head.position.copy(this.headBody.position)
      this.head.quaternion.copy(this.headBody.quaternion)

      // Update weapon position

      const distanceFromHead = this.camera.position.distanceTo(this.headBody.position) - 2
      // console.log(distanceFromHead)
      this.thongBody.position.set(this.mousePosition.position3D.x, this.mousePosition.position3D.y, 1.1)

      // update CANNON debugger/visualiser
      if (this.debug.active) this.cannonDebugger.update()
    }
  }
}


// constructor () {
//   this.world = new CANNON.World()
//   this.world.gravity.set(0, -9.82, 0)
//   this.world.broadphase = new CANNON.NaiveBroadphase()
//   this.world.solver.iterations = 10
//   this.world.defaultContactMaterial.contactEquationStiffness = 1e9
//   this.world.defaultContactMaterial.contactEquationRelaxation = 1
//   this.world.defaultContactMaterial.friction = 0
//   this.world.defaultContactMaterial.frictionEquationStiffness = 1e9
//   this.world.defaultContactMaterial.frictionEquationRegularizationTime = 100
// }

// update () {
//   this.world.step(1 / 60)
// }

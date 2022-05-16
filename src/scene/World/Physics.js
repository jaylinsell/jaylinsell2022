import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import Experience from '@/scene'

export default class Physics {
  constructor () {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.resources = this.experience.resources

    this.world = new CANNON.World()
    this.world.broadphase = new CANNON.SAPBroadphase(this.world)
    // this.world.allowSleep = true
    this.world.solver.iterations = 5
    this.world.gravity.set(0, -9.82, 0) // -9.82 being equal to earth gravity

    this.ready = false

    // Debuggers
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

    // get models once loaded
    this.resources.on('ready', () => {
      this.head = this.experience.world.head.headModel

      this.setPhysicMaterials()
      this.setFloor()
      this.setHeadShape()
      this.setPointToPointConstraints()

      this.ready = true
    })

  }

  setPhysicMaterials () {
    this.concreteMaterial = new CANNON.Material('concrete')
    this.headMaterial = new CANNON.Material('head')

    const concreteHeadContactMaterial = new CANNON.ContactMaterial(
      this.concreteMaterial,
      this.headMaterial,
      {
        friction: 0.1,
        restitution: 0.4,
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


    // this.world.addBody(this.testBody)

    // Shape setups
    this.cylinderRadius = 0.05
    this.cylinderRadiusBottom = 0.05
    this.cylinderHeight = 0.5
    this.cylinderNumSegements = 8

    // Set Shapes
    this.baseSkullShape = new CANNON.Sphere(0.55)
    this.chinShape = new CANNON.Sphere(0.33)
    this.eyeShape = new CANNON.Box(new CANNON.Vec3(0.45, 0.35, 0.1))
    this.hairShape = new CANNON.Cylinder(this.cylinderRadius, 0.5, this.cylinderHeight, this.cylinderNumSegements)

    // Actual body/group
    this.headBody = new CANNON.Body({
      mass: 2,
      position: new CANNON.Vec3(...this.head.position),
    })

    this.headBody.linearDamping = 0.5
    this.headBody.angularDamping = 0.5

    // Apply shapes
    this.headBody.addShape(this.baseSkullShape)
    this.headBody.addShape(this.chinShape, new CANNON.Vec3(-0.05, -0.45, 0.25))
    this.headBody.addShape(this.eyeShape, new CANNON.Vec3(-0.05, -0.1, 0.4))
    this.headBody.addShape(this.hairShape, new CANNON.Vec3(0, 0.6, 0))

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

  update () {
    this.world.step(1 / 60, this.time.delta, 3)

    if (this.ready) {
      this.head.position.copy(this.headBody.position)
      this.head.quaternion.copy(this.headBody.quaternion)

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

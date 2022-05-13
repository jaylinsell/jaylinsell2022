import CANNON from 'cannon'
import Experience from '@/scene'

export default class Physics {
  constructor () {
    this.experience = new Experience()
    this.time = this.experience.time
    this.resources = this.experience.resources

    this.world = new CANNON.World()
    this.world.gravity.set(0, -2, 0) // -9.82 being equal to earth gravity

    this.ready = false

    // get models once loaded
    this.resources.on('ready', () => {
      this.head = this.experience.world.head.headModel

      this.setPhysicMaterials()
      this.setFloor()
      this.setHeadShape()

      this.ready = true
    })

  }

  setPhysicMaterials () {
    this.concreteMaterial = new CANNON.Material('concrete')
    this.headMaterial = new CANNON.Material('head')

    const concreteHeadContactMaterial = new CANNON.ContactMaterial(this.concreteMaterial, this.headMaterial, {
      friction: 0.1,
      restitution: 0.6,
    })

    this.world.addContactMaterial(concreteHeadContactMaterial)
  }

  setFloor() {
    this.floorShape = new CANNON.Plane()
    this.floorBody = new CANNON.Body()

    this.floorBody.mass = 0
    this.floorBody.material = this.concreteMaterial
    this.floorBody.addShape(this.floorShape)

    this.floorBody.position.set(0, -1, 0)
    this.floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)

    this.world.addBody(this.floorBody)
  }

  setHeadShape () {
    // Set up a physics object in the closest shape of the head
    this.headShape = new CANNON.Sphere(0.5)
    this.headBody = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(2, 3, 0),
      shape: this.headShape,
      force: new CANNON.Vec3(1, 0, 0),
    })
    console.log(this.headBody)

    this.headBody.material = this.headMaterial

    this.world.add(this.headBody)
  }

  update () {
    this.world.step(1 / 60, this.time.delta, 3)

    if (this.ready) {
      this.head.position.copy(this.headBody.position)
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

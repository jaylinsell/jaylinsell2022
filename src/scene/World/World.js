import Experience from '@/scene'
import Floor from './Floor'

export default class World {
  constructor () {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    // wait for the resources
    this.resources.on('ready', () => {
      console.log('ready')
      // setup
      this.floor = new Floor()
    })
  }

  update () {
  }
}

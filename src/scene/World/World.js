import * as THREE from 'three'
import Experience from '@/scene'
import Floor from './Floor'
import Head from './Head'

export default class World {
  constructor () {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.floor = new Floor()

    // wait for the resources
    this.resources.on('ready', () => {
      console.log('ready')
      // setup
      this.head = new Head()
    })
  }

  update () {
  }
}

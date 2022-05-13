import * as THREE from 'three'
import Experience from '@/scene'
import Floor from './Floor'
import Logo from './Logo'
import Head from './Head'
import Eye from './Eye'

export default class World {
  constructor () {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.debug = this.experience.debug

    // this.floor = new Floor()
    // this.floor.receiveShadow = true

    // wait for the resources
    this.resources.on('ready', () => {
      console.log('ready')
      // setup
      this.head = new Head()
      this.logo = new Logo()
    })
  }

  update () {
  }
}

// import * THREE from 'three'
import * as dat from 'lil-gui'

export default class Debugger {
  constructor () {
    this.active = window.location.hash === '#debug'

    if (this.active) {
      this.ui = new dat.GUI()
    }
  }
}

export default class MousePosition {
  constructor () {
    this.x = 0
    this.y = 0

    window.addEventListener('mousemove', e => this.setMousePosition(e))
  }

  setMousePosition ({ x, y }) {
    // assign normalised values (-1 to 1)
    this.x = (x / window.innerWidth) * 2 - 1
    this.y = - (y / window.innerHeight) * 2 + 1
  }


  destroyListener () {
    window.removeEventListener('mousemove', e => this.setMousePosition(e))
  }
}

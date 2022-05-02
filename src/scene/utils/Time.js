import EventEmitter from './EventEmitter'

export default class Time extends EventEmitter {
  constructor () {
    super()

    this.start = Date.now()
    this.elapsed = this.start
    this.current = 0
    this.delta = 16 // the avg time between frames

    window.requestAnimationFrame(() => this.tick())
  }

  tick () {
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = currentTime - this.start

    this.trigger('tick')

    window.requestAnimationFrame(() => this.tick())
  }
}

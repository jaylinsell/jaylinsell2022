import { TextureLoader, Group, MeshBasicMaterial, DoubleSide, ShapeGeometry, Mesh, Color } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import EventEmitter from './EventEmitter'

export default class Resources extends EventEmitter {
  constructor (sources) {
    super()

    this.sources = sources || []

    this.items = []
    this.toLoad = this.sources.length
    this.loaded = 0

    this.setLoaders()
    this.startLoaders()
  }

  setLoaders () {
    this.loaders = {}
    this.loaders.textureLoader = new TextureLoader()
    this.loaders.svgLoader = new SVGLoader()
    this.loaders.dracoLoader = new DRACOLoader()
    this.loaders.gltfLoader = new GLTFLoader()

    this.loaders.dracoLoader.setDecoderPath('/draco/')
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
  }

  startLoaders () {
    const { gltfLoader, textureLoader, svgLoader } = this.loaders

    for (const source of this.sources) {
      if (source.type === 'gltfModel') {
        gltfLoader.load(source.path, file => this.sourceLoaded(source, file))
      }

      if (source.type === 'texture') {
        textureLoader.load(source.path, file => this.sourceLoaded(source, file))
      }

      if (source.type === 'svg') {
        svgLoader.load(source.path, file => this.sourceLoaded(source, file))
      }
    }
  }

  sourceLoaded (source, _file) {
    const file = source.type.includes('svg') ? this.convertSvgToMesh(_file) : _file

    this.items[source.name] = file
    this.loaded++

    if (this.loaded === this.toLoad) this.trigger('ready')
  }

  convertSvgToMesh (file) {
    const paths = file.paths
    const group = new Group()

    // convert paths to object meshes and add them to a group so we can add them to the scene
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i]
      const fillColor = path.userData.style.fill

      // Assign material
      // const material = new MeshBasicMaterial({
      //   color: new Color().setStyle( fillColor ).convertSRGBToLinear(),
      //   opacity: 1,
      //   side: DoubleSide,
      //   transparent: true,
      //   depthWrite: false
      // })

      if ( fillColor !== undefined && fillColor !== 'none' ) {
        const material = new MeshBasicMaterial( {
          color: new Color().setStyle( fillColor ).convertSRGBToLinear(),
          opacity: path.userData.style.fillOpacity,
          transparent: true,
          side: DoubleSide,
          depthWrite: false,
        })

        const shapes = SVGLoader.createShapes( path )

        for ( let j = 0; j < shapes.length; j ++ ) {
          const shape = shapes[ j ]

          const geometry = new ShapeGeometry( shape )
          const mesh = new Mesh( geometry, material )

          group.add( mesh )
        }
      }

      const strokeColor = path.userData.style.stroke
      if ( strokeColor !== undefined && strokeColor !== 'none' ) {

        const material = new MeshBasicMaterial( {
          color: new Color().setStyle( strokeColor ).convertSRGBToLinear(),
          opacity: path.userData.style.strokeOpacity,
          transparent: true,
          side: DoubleSide,
          depthWrite: false,
          wireframe: guiData.strokesWireframe
        })

        for ( let j = 0, jl = path.subPaths.length; j < jl; j ++ ) {
          const subPath = path.subPaths[j]

          const geometry = SVGLoader.pointsToStroke( subPath.getPoints(), path.userData.style )

          if ( geometry ) {
            const mesh = new Mesh( geometry, material )

            group.add( mesh )
          }
        }
      }
    }
    console.log(group)
    // // Center the geometry
    // const position = new Vector3()
    // const box = new Box3().setFromObject(group)
    // console.log(box.getCenter(position))



    return group
  }
}

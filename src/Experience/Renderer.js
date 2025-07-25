import * as THREE from 'three'
import Experience from './Experience.js'

export default class Renderer {
    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.setInstance()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            preserveDrawingBuffer: true,
            antialias: true
        })
        // this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMapping = THREE.ReinhardToneMapping
        // this.instance.toneMapping = THREE.ACESFilmicToneMapping
        // this.instance.toneMapping = THREE.LinearToneMapping
        // this.instance.toneMapping = THREE.NoToneMapping
        this.instance.toneMappingExposure = 1.45
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearColor('#211d20')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        
        if (this.experience.debug.active) {
            const toneMappingOptions = {
                'NoToneMapping': THREE.NoToneMapping,
                'LinearToneMapping': THREE.LinearToneMapping,
                'ReinhardToneMapping': THREE.ReinhardToneMapping,
                'CineonToneMapping': THREE.CineonToneMapping,
                'ACESFilmicToneMapping': THREE.ACESFilmicToneMapping
            }

            // Dummy config object to bind UI
            const params = {
                toneMapping: this.instance.toneMapping,
                toneMappingExposure: this.instance.toneMappingExposure
            }

            // Dropdown for tone mapping
            this.experience.debug.ui
                .add(params, 'toneMapping', toneMappingOptions)
                .name('Tone Mapping')
                .onChange((value) => {
                    this.instance.toneMapping = parseInt(value)
                })

            // Slider for tone mapping exposure
            this.experience.debug.ui
                .add(params, 'toneMappingExposure')
                .min(0)
                .max(10)
                .step(0.001)
                .name('Exposure')
                .onChange((value) => {
                    this.instance.toneMappingExposure = value
                })
        }

    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update() {
        // this.instance.render(this.scene, this.camera.instance)
    }
}
import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.debug = this.experience.debug

        this.setInstance()
        this.setControls()

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('camera')
            this.debugFolder.add(this.instance.position, 'x').
                min(-5).max(5).name('Position X').step(0.001)
            this.debugFolder.add(this.instance.position, 'y').
                min(-5).max(5).name('Position Y').step(0.001)
            this.debugFolder.add(this.instance.position, 'z').
                min(-5).max(5).name('Position Z').step(0.001)

            this.debugFolder.add(this.instance.rotation, 'x').
                min(-5).max(5).name('Rotation X').step(0.001)
            this.debugFolder.add(this.instance.rotation, 'y').
                min(-5).max(5).name('Rotation Y').step(0.001)
            this.debugFolder.add(this.instance.rotation, 'z').
                min(-5).max(5).name('Rotation Z').step(0.001)

            this.debugFolder.add(this.instance, 'fov').
                min(0).max(50).step(0.001).onChange((value) => {
                    this.instance.fov = value
                    this.instance.updateProjectionMatrix()
                })
            this.debugFolder.close()
        }
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(20, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(1.36,
            0.66,
            -3.46)

        this.instance.rotation.set(-3.08,
            0.38,
            -3.46)
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.target.set(0,
            0.45,
            -0.002687822557641357,)
        this.controls.enableDamping = true
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }
}
import * as THREE from 'three'
import Experience from '../Experience.js'
import { Reflector } from 'three/addons/objects/Reflector.js';

export default class Store {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('store')
            this.debugFolder.close()
        }

        // Resource
        this.resource = this.resources.items.storeModel
        this.setModel()
        this.setFloorTextures()
        this.addReflection()
        this.enhanceTVColors()
        this.addShine()
        this.changeShelfMaterialColor()
        this.changeShelfFrameMaterial()
        this.changeGlassMaterial()
        this.changeTableMetalMaterial()
        // this.createReflector()
    }

    setModel() {
        this.model = this.resource.scene
        console.log(this.model);

        this.model.scale.set(0.2, 0.2, 0.2)
        this.model.rotation.set(0, Math.PI - Math.PI / 8, 0)
        this.scene.add(this.model)

        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
            }
        })
    }

    setFloorTextures() {
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.name == 'Floor') {
                child.material.normalMap = this.resources.items.floorNormal
                child.material.aoMap = this.resources.items.floorAO
                child.material.diffuse = this.resources.items.floorDiffuse

                child.material.normalMap.colorSpace = THREE.SRGBColorSpace
                child.material.diffuse.colorSpace = THREE.SRGBColorSpace
                child.material.aoMap.colorSpace = THREE.SRGBColorSpace

                child.material.normalMap.repeat.set(4, 4)
                child.material.aoMap.repeat.set(4, 4)
                child.material.diffuse.repeat.set(4, 4)

                child.material.diffuse.wrapS = THREE.RepeatWrapping
                child.material.diffuse.wrapT = THREE.RepeatWrapping

                child.material.normalMap.wrapS = THREE.RepeatWrapping
                child.material.normalMap.wrapT = THREE.RepeatWrapping

                child.material.aoMap.wrapS = THREE.RepeatWrapping
                child.material.aoMap.wrapT = THREE.RepeatWrapping

                child.material.emissiveIntensity = 0.45

                child.material.emissive.set('#907f90')


                child.material.needsUpdate = true

                if (this.debug.active && child.material instanceof THREE.MeshStandardMaterial) {
                    const materialFolder = this.debugFolder.addFolder(`Material: ${child.name}`)

                    // Emissive color
                    materialFolder
                        .addColor({ emissive: `#${child.material.emissive.getHexString()}` }, 'emissive')
                        .name('Emissive Color')
                        .onChange((value) => {
                            child.material.emissive.set(value)
                        })

                    // Emissive intensity
                    materialFolder
                        .add(child.material, 'emissiveIntensity')
                        .name('Emissive Intensity')
                        .min(0)
                        .max(10)
                        .step(0.01)

                    // Metalness = specular-like reflection
                    materialFolder
                        .add(child.material, 'metalness')
                        .name('Metalness')
                        .min(0)
                        .max(1)
                        .step(0.01)

                    // Roughness = reflectivity control
                    materialFolder
                        .add(child.material, 'roughness')
                        .name('Roughness')
                        .min(0)
                        .max(1)
                        .step(0.01)

                    // Optional: Reflectivity (only if using MeshPhysicalMaterial)
                    if (child.material.reflectivity !== undefined) {
                        materialFolder
                            .add(child.material, 'reflectivity')
                            .name('Reflectivity')
                            .min(0)
                            .max(1)
                            .step(0.01)
                    }

                    materialFolder.close()
                }

            }

        })
    }

    addReflection() {
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.name == 'Floor') {
                child.castShadow = true
                this.experience.ssrObjects.push(child)
            }
        })
    }

    enhanceTVColors() {
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.name == 'campaign-mesh') {
                // child.material.color.set(0x000000)
                child.material.metalness = 0.1
            }
        })
    }

    changeShelfMaterialColor() {
        this.model.traverse((child) => {

            if (child.parent.name != 'Table_' && child instanceof THREE.Mesh &&
                (child.name == 'product-drop-1' ||
                    child.name == 'product-drop-2' ||
                    child.name == 'product-drop-3' ||
                    child.name == 'product-drop-4'
                )) {
                const newMaterial = child.material.clone()
                newMaterial.color.set('white')
                newMaterial.opacity = 1
                
                newMaterial.transparent = true
                child.material = newMaterial
            }
        })
    }

    changeShelfFrameMaterial() {
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material.name == 'Shelf_Material') {
                // child.material.color.set('red')
                child.material.color.set('white')
                console.log(child.material);
                
                child.material.metalness = 0
                child.material.roughness = 1
                child.material.emissive.set('rgba(196, 196, 196, 0.56)')
                child.material.emissiveIntensity = 0.5
                child.material.needsUpdate = true
            }
        })
    }
    createReflector() {
        this.model.traverse((child) => {
            if (
                child instanceof THREE.Mesh &&
                (child.name === 'Mirror_left' || child.name === 'Mirror_right')
            ) {
                const reflector = new Reflector(child.geometry, {
                    color: 0xffffff,
                    textureWidth: this.experience.sizes.width,
                    textureHeight: this.experience.sizes.height,
                });

                reflector.position.copy(child.position);
                reflector.rotation.copy(child.rotation);
                reflector.scale.copy(child.scale);
                child.add(reflector);
                reflector.position.set(0, 0, 0);
                reflector.position.x -= 0.01
                // reflector.rotation.set(0, 0, 0);

                const axesHelper = new THREE.AxesHelper(40);
                this.scene.add(axesHelper);
            }
        });
    }

    addShine() {
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.name == 'Table_1') {
                const mat = child.material
                mat.metalness = 1
                mat.roughness = 0.1
                mat.color.set(0xffffff)
                mat.envMap = this.resources.items.environmentMap
                mat.envMapIntensity = 30
                mat.needsUpdate = true

                if (this.debug.active) {
                    // Add a callback to update material when envMapIntensity changes
                    this.debugFolder.add(mat, 'envMapIntensity').min(0).max(100).step(0.001).onChange(() => {
                        // mat.needsUpdate = true
                    })
                    this.debugFolder.add(this.resources.items.environmentMap, 'rotation').min(0).max(Math.PI * 2).step(0.001)
                }
            }
        });
    }

    changeGlassMaterial() {
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (child.material.name === "Shelf_Glass_Material") {
                    child.material.reflectivity = 1
                    child.material.refrationRatio = 1.47
                    child.material.metalness = 0.3
                    child.material.opacity = 0.5
                    child.material.roughness = 1
                }
            }
        })
    }

    changeTableMetalMaterial() {
        this.model.traverse((child) => {
            if (child.material && child.material.name === "Table_Metal_Material") {
                child.material.metalness = 1
                child.material.roughness = 0
                console.log(child.material);
                child.material.color.set('rgb(245, 214, 219)')
                child.material.emissive.set('rgb(0, 0, 0)')
                child.material.emissiveIntensity = 90
            }
        })
    }
}

import * as THREE from 'three'
import Experience from './Experience.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass.js'
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader.js'
import { BrightnessContrastShader } from 'three/examples/jsm/shaders/BrightnessContrastShader.js'
import { ACESFilmicToneMappingShader } from 'three/addons/shaders/ACESFilmicToneMappingShader.js'
import { ColorifyShader } from 'three/addons/shaders/ColorifyShader.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'

export default class PostProcessing {
    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.renderer = this.experience.renderer
        this.ssrobjects = this.experience.ssrObjects
        this.debug = this.experience.debug

        this.setupEffectComposer()
        this.addSSRPass()
        // this.addSAOPass()
        this.addBloomPass()
        this.addColorCorrectionPass()
        // this.addBrightnessContrastPass()
        // this.addACESFilmicToneMappingPass()
        // this.addColorifyPass()
        this.addFXAAAntiAliasPass()
        // this.addSMAAAntiAliasPass()   
        // this.addGammaCorrectionPass()
        this.addOutputPass()
    }

    setupEffectComposer() {
        this.effectComposer = new EffectComposer(this.renderer.instance)
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio)

        this.renderPass = new RenderPass(this.scene, this.camera.instance)
        this.effectComposer.addPass(this.renderPass)
    }

    addSSRPass() {
        const ssrPass = new SSRPass({
            renderer: this.experience.renderer.instance,
            scene: this.experience.scene,
            camera: this.experience.camera.instance,
            width: this.experience.sizes.width,
            height: this.experience.sizes.height,
            selects: this.experience.ssrObjects

        })
        ssrPass.renderToScreen = true;
        ssrPass.infiniteThick = false;
        ssrPass.maxDistance = 1;
        ssrPass.thickness = 0;
        ssrPass.maxDistance = 10;
        ssrPass.distanceAttenuation = false;
        ssrPass.fresnel = true;
        ssrPass.blur = false;
        ssrPass.opacity = 0.18
        // ssrPass.bouncing = true
        ssrPass.tempColor = new THREE.Color(0xffffff)

        if (this.debug.active) {
            const SSREffectFolder = this.debug.ui.addFolder("SSR Properties");
            SSREffectFolder.add(ssrPass, "infiniteThick");
            SSREffectFolder.add(ssrPass, "renderToScreen");
            SSREffectFolder.add(ssrPass, "opacity").min(0).max(1).step(0.01);
            SSREffectFolder.add(ssrPass, "height").min(0).max(100).step(0.1);
            SSREffectFolder.add(ssrPass, "width").min(0).max(100).step(0.1);
            SSREffectFolder.add(ssrPass, "maxDistance").min(0).max(100).step(0.1);
            SSREffectFolder.add(ssrPass, "thickness").min(0).max(10).step(0.0001);
            SSREffectFolder.add(ssrPass, "distanceAttenuation").onChange((value) => {
                ssrPass.distanceAttenuation = value;
            });
            SSREffectFolder.add(ssrPass, "blur");
            SSREffectFolder.add(ssrPass, "fresnel");
            SSREffectFolder.add(ssrPass, "output", {
                Default: SSRPass.OUTPUT.Default,
                "SSR Only": SSRPass.OUTPUT.SSR,
                Beauty: SSRPass.OUTPUT.Beauty,
                Depth: SSRPass.OUTPUT.Depth,
                Normal: SSRPass.OUTPUT.Normal,
                Metalness: SSRPass.OUTPUT.Metalness,
            }).onChange(function (value) {
                ssrPass.output = value;
            });
            SSREffectFolder.close();
        }

        this.effectComposer.addPass(ssrPass)
    }

    addBloomPass() {
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.sizes.width, this.sizes.height),
            0.1, // strength
            0.04,  // radius
            6.59 // threshold
        );
        this.effectComposer.addPass(bloomPass);

        if (this.debug.active) {
            const BloomEffectFolder = this.debug.ui.addFolder("Bloom Properties");
            BloomEffectFolder.add(bloomPass, "strength").min(0).max(3).step(0.01).name("Bloom Strength");
            BloomEffectFolder.add(bloomPass, "radius").min(0).max(1).step(0.01).name("Bloom Radius");
            BloomEffectFolder.add(bloomPass, "threshold").min(0).max(100).step(0.01).name("Bloom Threshold");
            BloomEffectFolder.close();
        }
    }


    addSAOPass() {
        const saoPass = new SAOPass(this.scene, this.camera.instance, false, true)
        saoPass.clear = true;
        // saoPass.renderToScreen = true; 

        saoPass.params.saoBias = 0.5
        saoPass.params.saoIntensity = 0.4
        saoPass.params.saoScale = 52
        saoPass.params.saoKernelRadius = 100
        saoPass.params.saoMinResolution = 0
        saoPass.blur = true;

        this.effectComposer.addPass(saoPass)

        if (this.debug.active) {
            const SAOEffectFolder = this.debug.ui.addFolder("SAO Properties");
            SAOEffectFolder.add(saoPass.params, "saoBias").min(0).max(1).step(0.0001)
            SAOEffectFolder.add(saoPass.params, "saoIntensity").min(0).max(1).step(0.0001)
            SAOEffectFolder.add(saoPass.params, "saoScale").min(0).max(100).step(0.1)
            SAOEffectFolder.add(saoPass.params, "saoKernelRadius").min(0).max(100).step(0.1)
            SAOEffectFolder.add(saoPass.params, "saoMinResolution").min(0).max(100).step(0.1)
            SAOEffectFolder.close();

        }
    }

    addOutputPass() {
        const outputPass = new OutputPass()
        this.effectComposer.addPass(outputPass)
    }

    addSMAAAntiAliasPass() {
        const smaaPass = new SMAAPass()
        this.effectComposer.addPass(smaaPass)
    }

    addTAAPass() {
        const taaPass = new TAARenderPass(this.scene, this.camera.instance)
        taaPass.sampleLevel = 50
        this.effectComposer.addPass(taaPass)
    }

    addFXAAAntiAliasPass() {
        const fxaaPass = new ShaderPass(FXAAShader);
        const pixelRatio = this.experience.renderer.instance.getPixelRatio();
        fxaaPass.uniforms['resolution'].value.x = 1 / (this.sizes.width * pixelRatio);
        fxaaPass.uniforms['resolution'].value.y = 1 / (this.sizes.height * pixelRatio);
        this.effectComposer.addPass(fxaaPass)
    }

    addSSAAntiAliasPass() {
        const ssaaPass = new SSAARenderPass(this.scene, this.camera.instance)
        this.effectComposer.addPass(ssaaPass)
    }

    addColorCorrectionPass() {
        const colorCorrectionPass = new ShaderPass(ColorCorrectionShader)
        colorCorrectionPass.uniforms['powRGB'].value.set(1.25, 1.25, 1.25)
        colorCorrectionPass.uniforms['mulRGB'].value.set(1.05, 1.05, 1)

        console.log(colorCorrectionPass);

        if (this.debug.active) {
            const colorCorrectionFolder = this.debug.ui.addFolder("Color Correction Properties");

            // powRGB — gamma control (usually around 0.5–2.0)
            colorCorrectionFolder.add(colorCorrectionPass.uniforms['powRGB'].value, "x").min(0.1).max(2.0).step(0.01).name("Gamma R");
            colorCorrectionFolder.add(colorCorrectionPass.uniforms['powRGB'].value, "y").min(0.1).max(2.0).step(0.01).name("Gamma G");
            colorCorrectionFolder.add(colorCorrectionPass.uniforms['powRGB'].value, "z").min(0.1).max(2.0).step(0.01).name("Gamma B");

            // mulRGB — linear brightness multiplier (typically 0.5–2.0)
            colorCorrectionFolder.add(colorCorrectionPass.uniforms['mulRGB'].value, "x").min(0.5).max(2.0).step(0.01).name("Gain R");
            colorCorrectionFolder.add(colorCorrectionPass.uniforms['mulRGB'].value, "y").min(0.5).max(2.0).step(0.01).name("Gain G");
            colorCorrectionFolder.add(colorCorrectionPass.uniforms['mulRGB'].value, "z").min(0.5).max(2.0).step(0.01).name("Gain B");
            colorCorrectionFolder.close();
        }

        this.effectComposer.addPass(colorCorrectionPass)
    }

    addBrightnessContrastPass() {
        const brightnessContrastPass = new ShaderPass(BrightnessContrastShader)
        brightnessContrastPass.uniforms['brightness'].value = 0
        brightnessContrastPass.uniforms['contrast'].value = 0.11
        this.effectComposer.addPass(brightnessContrastPass)
    }

    addACESFilmicToneMappingPass() {
        const acesFilmicToneMappingPass = new ShaderPass(ACESFilmicToneMappingShader)
        acesFilmicToneMappingPass.uniforms['exposure'].value = 0.8
        this.effectComposer.addPass(acesFilmicToneMappingPass)
    }

    addColorifyPass() {
        const colorifyPass = new ShaderPass(ColorifyShader)
        colorifyPass.uniforms['color'].value.set(1, 1, 0.5)
        this.effectComposer.addPass(colorifyPass)
    }

    addGammaCorrectionPass() {
        const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
        this.effectComposer.addPass(gammaCorrectionPass)
    }

    resize() {
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio)
    }

    update() {
        this.effectComposer.render()
    }
}
export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
        [
            'textures/environmentMap/px.jpg',
            'textures/environmentMap/nx.jpg',
            'textures/environmentMap/py.jpg',
            'textures/environmentMap/ny.jpg',
            'textures/environmentMap/pz.jpg',
            'textures/environmentMap/nz.jpg'
        ]
    },
    {
        name: 'environmentMap',
        type: 'envMap',
        path: '/textures/environmentMap/envMap.hdr'
    },
    {
        name: 'floorAO',
        type: 'texture',
        path: '/textures/models/4K-marble_tiles_2-ao.jpg'
    },
    {
        name: 'floorDiffuse',
        type: 'texture',
        path: '/textures/models/4K-marble_tiles_2-diffuse.jpg'
    },
    {
        name: 'floorDisplacement',
        type: 'texture',
        path: '/textures/models/4K-marble_tiles_2-displacement.jpg'
    },
    {
        name: 'floorNormal',
        type: 'texture',
        path: '/textures/models/4K-marble_tiles_2-normal.jpg'
    },
    {
        name: 'floorSpecular',
        type: 'texture',
        path: '/textures/models/4K-marble_tiles_2-specular.jpg'
    },
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: 'textures/dirt/color.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'textures/dirt/normal.jpg'
    },
    {
        name: 'foxModel',
        type: 'gltfModel',
        path: 'models/Fox/glTF/Fox.gltf'
    },
    {
        name: 'storeModel',
        type: 'gltfModel',
        path: 'models/Store/Store-Baked.glb'
    }
]
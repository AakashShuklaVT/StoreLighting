import Experience from '../Experience.js'
import Environment from './Environment.js'
import Store from './Store.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.store = new Store()
            this.environment = new Environment()
        })
    }

    update()
    {
       
    }
}
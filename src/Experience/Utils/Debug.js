import GUI from 'lil-gui'

export default class Debug
{
    constructor()
    {
        this.active = window.location.hash === '#debug'

        if(this.active)
        {
            this.ui = new GUI()
            this.ui.domElement.style.position = 'absolute'
            this.ui.domElement.style.left = '0'
            this.ui.domElement.style.top = '0'
        }
    }
}
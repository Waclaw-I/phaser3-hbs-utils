import Phaser from 'phaser'
import { Button } from '../../src/utils/buttons/Button'
import { InputEvent } from '../../src/utils/types/input'

export default class HelloWorldScene extends Phaser.Scene
{
	constructor()
	{
		super('hello-world')
	}

	preload()
    {
        this.load.setBaseURL('http://labs.phaser.io')

        this.load.image('sky', 'assets/skies/space3.png')
        this.load.image('logo', 'assets/sprites/phaser3-logo.png')
        this.load.image('red', 'assets/particles/red.png')
    }

    create()
    {
        this.add.image(400, 300, 'sky')

        const button = new Button(this, 400, 150, 'logo');

        button.on(InputEvent.PointerDown, () => {
            console.log('clicked');
        });
    }
}
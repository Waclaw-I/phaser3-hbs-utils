import Phaser from 'phaser';
import { StatesButton } from '../../src/utils/buttons/StatesButton/StatesButton';
import { ButtonState } from '../../src/utils/buttons/StatesButton/StatesButtonBase';
import { ButtonEvent } from '../../src/utils/types/Types';

export default class HelloWorldScene extends Phaser.Scene
{
	constructor()
	{
		super('hello-world');
	}

	preload()
    {
        this.load.atlas('buttonBlue', `images/buttons/buttonBlue.png`, `images/buttons/buttonBlue.json`);
        this.load.bitmapFont('ice', 'bitmapfonts/iceicebaby.png', 'bitmapfonts/iceicebaby.xml');

        this.load.image('crate', 'http://labs.phaser.io/assets/sprites/block.png');
        this.load.image('apple', 'http://labs.phaser.io/assets/sprites/apple.png');
    }

    create()
    {
        const button = new StatesButton(
            this,
            { x: 400, y: 400 },
            {
                background: {
                    [ButtonState.Idle]: { key: 'buttonBlue', frame: 0 },
                    [ButtonState.Hover]: { key: 'buttonBlue', frame: 1 },
                    [ButtonState.Pressed]: { key: 'buttonBlue', frame: 2 },
                    [ButtonState.Disabled]: { key: 'buttonBlue', frame: 0 },
                },
                bitmapTextConfig: {
                    font: 'ice',
                    text: 'clickMe',
                    size: 40,
                    origin: 0.5,
                },
                topImage: {
                    key: 'crate',
                    scale: 0.5,
                },
                offsets: {
                    text: {
                        [ButtonState.Idle]: { x: 0, y: 0 },
                        [ButtonState.Hover]: { x: 0, y: 0 },
                        [ButtonState.Pressed]: { x: 0, y: 3 },
                        [ButtonState.Disabled]: { x: 0, y: 3 },
                    },
                    image: {
                        [ButtonState.Idle]: { x: 0, y: 0 },
                        [ButtonState.Hover]: { x: 0, y: 0 },
                        [ButtonState.Pressed]: { x: 0, y: 3 },
                        [ButtonState.Disabled]: { x: 0, y: 3 },
                    },
                },
            },
        );

        button.on(Phaser.Input.Events.POINTER_UP, () => {
            console.log('clicked');
        });

        button.setTopImage({
            key: 'apple',
            scale: 0.5,
            origin: { x: 1, y: 0.5 },
        });
    }
}
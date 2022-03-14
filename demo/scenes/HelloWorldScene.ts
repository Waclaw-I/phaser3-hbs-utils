import Phaser from 'phaser';
import { StatesButton } from '../../src/utils/gui/buttons/StatesButton/StatesButton';
import { ButtonState } from '../../src/utils/gui/buttons/StatesButton/StatesButtonBase';
import { DragBox } from '../../src/utils/gui/containers/DragBox';
import { DraggableGrid } from '../../src/utils/gui/containers/grids/DraggableGrid';
import { Grid } from '../../src/utils/gui/containers/grids/Grid';
import { SimpleGridItem } from '../gameObjects/SimpleGridItem';
import { IconText } from '../../src/utils/gui/icons/IconText';

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

    create() {
        // const button = new StatesButton(
        //     this,
        //     { x: 0, y: 0 },
        //     {
        //         background: {
        //             [ButtonState.Idle]: { key: 'buttonBlue', frame: 0 },
        //             [ButtonState.Hover]: { key: 'buttonBlue', frame: 1 },
        //             [ButtonState.Pressed]: { key: 'buttonBlue', frame: 2 },
        //         },
        //         bitmapTextConfig: {
        //             font: 'ice',
        //             text: 'Text Yay',
        //             size: 40,
        //             origin: 0.5,
        //         },
        //         topImage: {
        //             key: 'crate',
        //             scale: 0.5,
        //         },
        //         offsets: {
        //             text: {
        //                 [ButtonState.Idle]: { x: 0, y: 0 },
        //                 [ButtonState.Hover]: { x: 0, y: 0 },
        //                 [ButtonState.Pressed]: { x: 0, y: 3 },
        //             },
        //             image: {
        //                 [ButtonState.Idle]: { x: 0, y: 0 },
        //                 [ButtonState.Hover]: { x: 0, y: 0 },
        //                 [ButtonState.Pressed]: { x: 0, y: 3 },
        //             },
        //         },
        //         scale: 1.5,
        //     },
        // );

        // button.on(Phaser.Input.Events.POINTER_UP, () => {
        //     console.log('clicked');
        // });

        // button.setTopImage({
        //     key: 'apple',
        //     scale: 0.5,
        //     origin: { x: 1, y: 0.5 },
        // });

        // const grid = new Grid(this, {
        //     position: { x: 0, y: 0 },
        //     horizontal: false,
        //     itemsInRow: 2,
        //     spacing: 5,
        // });

        const draggableGrid = new DraggableGrid(
            this,
            {
                position: { x: 400, y: 300 },
                maskPosition: { x: 400, y: 300 },
                dimension: { x: 400, y: 300 },
                horizontal: true,
                repositionToCenter: true,
                itemsInRow: 3,
                margin: {
                    left: 10,
                    right: 10,
                },
                spacing: 50,
            },
        );

        for (let i = 0; i < 20; ++i) {
            draggableGrid.addItem(new SimpleGridItem(this, `${i}`, 'apple'));
        }

        // const dragBox = new DragBox(this, {
        //     content: grid,
        //     height: 300,
        //     width: 300,
        //     margin: {
        //         top: 10,
        //         bottom: 10,
        //     },
        //     repositionToCenter: true,
        //     debug: {
        //         showDraggableSpace: true,
        //     },
        //     position: { x: 300, y: 300 },
        // });

        // const iconText = new IconText(
        //     this,
        //     {
        //         x: 400,
        //         y: 300,
        //         textConfig: {
        //             x: 0,
        //             y: 0,
        //             text: 'apple',
        //             size: 80,
        //             font: 'ice',
        //         },
        //         imageConfig: {
        //             key: 'apple',
        //         },
        //         spacing: 100,
        //         centered: true,
        //         textFirst: false,
        //         vertical: true,
        //     },
        // );

        // iconText.setIconScale(1);

        // this.add.image(400, 300, 'apple').setScale(0.2);
    }

}

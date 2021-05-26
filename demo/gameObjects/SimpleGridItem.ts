import { GridItem } from '../../src/utils/gui/containers/grids/GridItem';
import { Point } from '../../src/utils/types/Types';

export interface SimpleGridItemContentData {
    id: string;
    randomNumber: number;
}

export class SimpleGridItem extends GridItem {

    private image: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, id: string, key: string, frame?: string | number) {
        super(scene, id);

        this.image = this.scene.add.image(0, 0, key, frame);

        this.add(this.image);
        const { width, height } = this.getBounds();
        this.setSize(width, height);

        this.scene.add.existing(this);

    }

    public getContentData(): SimpleGridItemContentData {
        return {
            id: this.id,
            randomNumber: Math.random(),
        }
    }

    public getDimensions(): Point {
        return {
            x: this.image.displayWidth,
            y: this.image.displayHeight,
        };
    }
}
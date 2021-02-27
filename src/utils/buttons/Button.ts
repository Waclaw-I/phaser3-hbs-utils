
export class Button extends Phaser.GameObjects.Image {

    constructor(scene: Phaser.Scene, x: number, y: number, key: string, frame?: string | number) {
        super(scene, x, y, key, frame);

        this.setInteractive();

        this.scene.add.existing(this);
    }
}

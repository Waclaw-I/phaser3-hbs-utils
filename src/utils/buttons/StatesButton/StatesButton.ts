import { KeyFrame, Point } from '../../types/Types';
import { ButtonState, StatesButtonBase, StatesButtonConfigBase } from './StatesButtonBase';

export interface StatesButtonConfig extends StatesButtonConfigBase {
    background: Record<ButtonState, KeyFrame>;
}

export class StatesButton extends StatesButtonBase {

    protected background: Phaser.GameObjects.Image;
    protected config: StatesButtonConfig;

    constructor(scene: Phaser.Scene, position: Point, config: StatesButtonConfig) {
        super(scene, position, config);
    }

    public setTopImage(key: string, frame?: string | number): void {
        this.config.topImage = {
            key,
            frame,
        };
        if (!this.topImage) {
            this.topImage = this.scene.add.image(0, 0, key, frame);
            this.add(this.topImage);
            return;
        }
        this.topImage.setTexture(key, frame);
    }

    protected changeBackgroundTexture(state: ButtonState): void {
        this.background.setTexture(this.config.background[state].key, this.config.background[state].frame);
    }

    protected initializeBackground(): void {
        this.background = this.scene.add.image(
            0, 0, this.config.background[ButtonState.Idle].key, this.config.background[ButtonState.Idle].frame,
        )
            .setScale(this.config.scale ?? 1);

        this.add(this.background);
    }

    protected setTextToDefaultPosition(): void {
        this.text?.setPosition(0, this.background.y);
    }
}

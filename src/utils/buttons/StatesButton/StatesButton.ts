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

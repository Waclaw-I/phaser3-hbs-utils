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
            this.topImage = this.scene.add.image(
                0, -this.background.displayHeight * 0.5, key, frame).setOrigin(0.5, 0.5);
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
            0, 0, this.config.background[ButtonState.Idle].key, this.config.background[ButtonState.Idle].frame)
            .setOrigin(0.5, 1)
            .setScale(this.config.scale ?? 1);
        this.background.y += this.background.displayHeight * 0.5;
        this.add(this.background);
    }

    protected initializeText(): void {
        if (this.config.bitmapTextConfig) {
            const textConfig = this.config.bitmapTextConfig;
            this.text = this.scene.add.bitmapText(
                0,
                0,
                textConfig.font,
                textConfig.text ?? '',
                textConfig.size ?? 20,
            )
                .setOrigin(textConfig.origin?.x ?? 0.5, 0.6);
            if (this.config.bitmapTextConfig.size) {
                this.text.setFontSize(this.config.bitmapTextConfig.size);
            }

            this.setTextToDefaultPosition();

            if (textConfig.color) {
                this.text.setTint(textConfig.color);
            }
            this.add(this.text);
        }
    }

    protected initializeTopImage(): void {
        if (!this.config.topImage) {
            return;
        }
        this.topImage = this.scene.add.image(
            0, -this.background.displayHeight * 0.5, this.config.topImage.key, this.config.topImage.frame)
            .setOrigin(0.5, 0.5);
        this.add(this.topImage);

    }

    protected setTextToDefaultPosition(): void {
        this.text?.setPosition(
            0,
            this.background.y - this.background.displayHeight * 0.5,
        );
    }
}

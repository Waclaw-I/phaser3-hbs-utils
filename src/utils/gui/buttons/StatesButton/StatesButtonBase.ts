import { Point } from '../../../types/Types';

export enum ButtonState {
    Idle,
    Hover,
    Pressed,
}

export interface StatesButtonConfigBase {
    bitmapTextConfig: Phaser.Types.GameObjects.BitmapText.BitmapTextConfig;
    topImage?: Phaser.Types.GameObjects.Sprite.SpriteConfig;
    scale?: number;
    name?: string;
    offsets?: {
        text?: Record<ButtonState, Point>;
        image?: Record<ButtonState, Point>;
    };
}

export abstract class StatesButtonBase extends Phaser.GameObjects.Container {

    protected buttonState: ButtonState;

    protected topImage?: Phaser.GameObjects.Image;
    protected text?: Phaser.GameObjects.BitmapText;

    protected config: StatesButtonConfigBase;

    constructor(scene: Phaser.Scene, position: Point, config: StatesButtonConfigBase) {
        super(scene, position.x, position.y);
        this.name = config.name ?? '';
        this.config = config;
        this.buttonState = ButtonState.Idle;

        this.initializeBackground();
        if (this.config.topImage) {
            this.setTopImage(this.config.topImage);
        }
        if (this.config.bitmapTextConfig) {
            this.setText(this.config.bitmapTextConfig);
        }

        this.updateSize();
        this.setScale(this.config.scale ?? 1);
        this.changeState(ButtonState.Idle);
        
        this.setInteractive({ cursor: 'pointer' });
        this.scene.add.existing(this);

        this.bindEventHandlers();
    }

    public setTopImage(config: Phaser.Types.GameObjects.Sprite.SpriteConfig): void {
        if (this.topImage) {
            this.topImage.setActive(false).setVisible(false);
            this.remove(this.topImage, true);
        }

        this.topImage = this.scene.make.image(config, true);
        this.add(this.topImage);
        return;
    }

    public getTopImage(): Phaser.GameObjects.Image | undefined {
        return this.topImage;
    }

    public setText(config: Phaser.Types.GameObjects.BitmapText.BitmapTextConfig): void {
        if (this.text) {
            this.text.setActive(false).setVisible(false);
            this.remove(this.text, true);
        }

        this.text = this.scene.make.bitmapText(config, true);
        this.add(this.text);

        this.config.bitmapTextConfig = config;
    }

    public getText(): Phaser.GameObjects.BitmapText | undefined {
        return this.text;
    }

    public changeText(text: string): void {
        this.text?.setText(text);
    }

    public lockFromInput(lock: boolean = true): void {
        if (lock) {
            this.disableInteractive();
            return;
        }
        this.setInteractive({ cursor: 'pointer' });
    }

    private updateSize(): void {
        const bounds = this.getBounds();
        this.setSize(bounds.width, bounds.height);
        if (!this.input?.hitArea) {
            this.setInteractive({
                hitArea: new Phaser.Geom.Rectangle(0, 0, bounds.width, bounds.height),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                cursor: 'pointer',
            });
        }
        this.input.hitArea.setTo(0, 0, bounds.width, bounds.height);
    }

    private bindEventHandlers(): void {
        this.on(Phaser.Input.Events.POINTER_UP, () => {
            this.changeState(ButtonState.Idle);
        });
        this.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.changeState(ButtonState.Pressed);
        });
        this.on(Phaser.Input.Events.POINTER_OVER, () => {
            if (this.buttonState === ButtonState.Pressed) {
                return;
            }
            this.changeState(ButtonState.Hover);
        });
        this.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.changeState(ButtonState.Idle);
        });
    }

    protected abstract initializeBackground(): void;
    protected abstract changeBackgroundTexture(state: ButtonState): void;

    protected changeState(state: ButtonState): void {
        this.changeBackgroundTexture(state);
        this.buttonState = state;
        this.applyTextOffset(state);
        this.applyTopImageOffset(state);
    }

    private applyTopImageOffset(state: ButtonState): void {
        if (this.topImage) {
            const offset = this.config.offsets?.image?.[state];
            this.topImage.x = offset?.x ?? 0;
            this.topImage.y = offset?.y ?? 0;
        }
    }

    private applyTextOffset(state: ButtonState): void {
        if (this.text) {
            const offset = this.config.offsets?.image?.[state];
            this.text.x = offset?.x ?? 0;
            this.text.y = offset?.y ?? 0;
        }
    }
}

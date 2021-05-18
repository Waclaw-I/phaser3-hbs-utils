import { Point } from '../../types/Types';

export enum ButtonState {
    Idle,
    Hover,
    Pressed,
    Disabled,
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

    protected topImage: Phaser.GameObjects.Image;
    protected text: Phaser.GameObjects.BitmapText;

    protected isActive: boolean;
    protected isDisabled: boolean;

    protected config: StatesButtonConfigBase;

    constructor(scene: Phaser.Scene, position: Point, config: StatesButtonConfigBase) {
        super(scene, position.x, position.y);
        this.name = config.name ?? '';
        this.config = config;
        this.buttonState = ButtonState.Idle;

        this.initializeBackground();
        this.initializeTopImage();
        this.initializeText();

        this.updateSize();
        this.changeState(ButtonState.Idle);
        
        this.setInteractive({ cursor: 'pointer' });
        this.isActive = true;
        this.scene.add.existing(this);

        this.bindEventHandlers();
    }

    public lockFromInput(lock: boolean = true): void {
        if (lock) {
            this.disableInteractive();
            return;
        }
        this.setInteractive({ cursor: 'pointer' });
    }

    public makeActive(value: boolean = true): void {
        if (this.isActive === value) {
            return;
        }
        this.isActive = value;
    }

    public setTopImageDisplaySize(width: number, height: number): void {
        if (!this.topImage) {
            return;
        }
        this.topImage.setDisplaySize(width, height);
        this.updateSize();
    }

    public setText(text: string): void {
        this.text.setText(text);
    }

    public changeStateToDisabled(value: boolean = true): void {
        this.isDisabled = value;
        this.changeState(value ? ButtonState.Disabled : ButtonState.Idle);
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
            if (this.buttonState !== ButtonState.Pressed || this.isDisabled) {
                return;
            }
            this.changeState(ButtonState.Idle);
        });
        this.on(Phaser.Input.Events.POINTER_DOWN, () => {
            if (this.isDisabled) {
                return;
            }
            this.changeState(ButtonState.Pressed);
        });
        this.on(Phaser.Input.Events.POINTER_OVER, () => {
            if (this.isDisabled) {
                return;
            }
            if (this.buttonState === ButtonState.Pressed) {
                return;
            }
            this.changeState(ButtonState.Hover);
        });
        this.on(Phaser.Input.Events.POINTER_OUT, () => {
            if (this.isDisabled) {
                return;
            }
            this.changeState(ButtonState.Idle);
        });
    }

    public abstract setTopImage(key: string, frame?: string | number): void;
    protected abstract initializeBackground(): void;
    protected abstract setTextToDefaultPosition(): void;
    protected abstract changeBackgroundTexture(state: ButtonState): void;

    protected initializeTopImage(): void {
        if (!this.config.topImage) {
            return;
        }
        this.topImage = this.scene.make.image(this.config.topImage, true);
        this.add(this.topImage);
    }
    
    protected initializeText(): void {
        if (!this.config.bitmapTextConfig) {
            return;
        }

        this.text = this.scene.make.bitmapText(this.config.bitmapTextConfig, true);
        this.setTextToDefaultPosition();
        this.add(this.text);
    }

    protected changeState(state: ButtonState): void {
        this.changeBackgroundTexture(state);
        this.buttonState = state;
        this.applyTextOffset(state);
        this.applyTopImageOffset(state);
    }

    private applyTopImageOffset(state: ButtonState): void {
        if (this.topImage) {
            this.setTopImageToDefaultPosition();
            let offset: Point | undefined;
            switch (state) {
                case ButtonState.Idle: {
                    offset = this.config.offsets?.image?.[0];
                    break;
                }
                case ButtonState.Hover: {
                    offset = this.config.offsets?.image?.[1];
                    break;
                }
                case ButtonState.Pressed: {
                    offset = this.config.offsets?.image?.[2];
                    break;
                }
            }
            this.topImage.x += offset?.x ?? 0;
            this.topImage.y += offset?.y ?? 0;
        }
    }

    private applyTextOffset(state: ButtonState): void {
        if (this.text) {
            this.setTextToDefaultPosition();
            let offset: Point | undefined;
            switch (state) {
                case ButtonState.Idle: {
                    offset = this.config.offsets?.text?.[0];
                    break;
                }
                case ButtonState.Hover: {
                    offset = this.config.offsets?.text?.[1];
                    break;
                }
                case ButtonState.Pressed: {
                    offset = this.config.offsets?.text?.[2];
                    break;
                }
            }
            this.text.x += offset?.x ?? 0;
            this.text.y += offset?.y ?? 0;
        }
    }

    private setTopImageToDefaultPosition(): void {
        this.topImage?.setPosition(0, 0);
    }
}

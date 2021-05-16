import { BitmapTextConfig, KeyFrame, Point } from '../../types/Types';
export declare enum ButtonState {
    Idle = 0,
    Hover = 1,
    Pressed = 2,
    Disabled = 3
}
export interface StatesButtonConfigBase {
    bitmapTextConfig: BitmapTextConfig;
    topImage?: KeyFrame;
    scale?: number;
    name?: string;
    offsets?: {
        text?: Record<ButtonState, Point>;
        image?: Record<ButtonState, Point>;
    };
}
export declare abstract class StatesButtonBase extends Phaser.GameObjects.Container {
    protected buttonState: ButtonState;
    protected topImage: Phaser.GameObjects.Image;
    protected text: Phaser.GameObjects.BitmapText;
    protected isActive: boolean;
    protected isDisabled: boolean;
    protected config: StatesButtonConfigBase;
    constructor(scene: Phaser.Scene, position: Point, config: StatesButtonConfigBase);
    lockFromInput(lock?: boolean): void;
    makeActive(value?: boolean): void;
    setTopImageDisplaySize(width: number, height: number): void;
    setText(text: string): void;
    changeStateToDisabled(value?: boolean): void;
    private updateSize;
    private bindEventHandlers;
    abstract setTopImage(key: string, frame?: string | number): void;
    protected abstract initializeBackground(): void;
    protected abstract initializeTopImage(): void;
    protected abstract setTextToDefaultPosition(): void;
    protected abstract changeBackgroundTexture(state: ButtonState): void;
    protected abstract initializeText(): void;
    protected changeState(state: ButtonState): void;
    private applyTopImageOffset;
    private applyTextOffset;
    private setTopImageToDefaultPosition;
}

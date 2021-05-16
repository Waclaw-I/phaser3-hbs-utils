import { KeyFrame, Point } from '../../types/Types';
import { ButtonState, StatesButtonBase, StatesButtonConfigBase } from './StatesButtonBase';
export interface StatesButtonConfig extends StatesButtonConfigBase {
    background: KeyFrame;
}
export declare class StatesButton extends StatesButtonBase {
    protected background: Phaser.GameObjects.Image;
    protected config: StatesButtonConfig;
    constructor(scene: Phaser.Scene, position: Point, config: StatesButtonConfig);
    setTopImage(key: string, frame?: string | number): void;
    protected changeBackgroundTexture(state: ButtonState): void;
    protected initializeBackground(): void;
    protected initializeText(): void;
    protected initializeTopImage(): void;
    protected setTextToDefaultPosition(): void;
}

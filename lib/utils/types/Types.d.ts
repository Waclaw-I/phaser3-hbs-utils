export declare enum InputEvent {
    PointerDown = "pointerdown",
    PointerUp = "pointerup",
    PointerOver = "pointerover",
    PointerOut = "pointerout"
}
export declare enum ButtonEvent {
    Clicked = "Clicked",
    HoverOver = "HoverOver",
    HoverOut = "HoverOut"
}
export interface KeyFrame {
    key: string;
    frame?: string | number;
}
export interface TextConfig {
    font: string;
    text: string;
    size: number;
    color?: number;
    origin?: {
        x: number;
        y?: number;
    };
}
export interface BitmapTextConfig {
    font: string;
    text: string;
    size?: number;
    color?: number;
    origin?: {
        x: number;
        y?: number;
    };
}
export interface Point {
    x: number;
    y: number;
}

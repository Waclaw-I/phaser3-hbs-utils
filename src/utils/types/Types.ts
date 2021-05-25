
export interface KeyFrame {
    key: string;
    frame?: string | number;
}


// TODO: Replace with types from phaser typedefs
export interface TextConfig {
    font: string;
    text: string;
    size: number;
    color?: number;
    origin?: {
        x: number;
        y?: number;
    }
}

export interface Point {
    x: number;
    y: number;
}

/**
 * NOTE: https://labs.phaser.io/edit.html?src=src/tweens\ease%20equations.js
 */
export enum Easing {
    Linear = 'Linear',
    QuadEaseIn = 'Quad.easeIn',
    CubicEaseIn = 'Cubic.easeIn',
    QuartEaseIn = 'Quart.easeIn',
    QuintEaseIn = 'Quint.easeIn',
    SineEaseIn = 'Sine.easeIn',
    ExpoEaseIn = 'Expo.easeIn',
    CircEaseIn = 'Circ.easeIn',
    BackEaseIn = 'Back.easeIn',
    BounceEaseIn = 'Bounce.easeIn',
    QuadEaseOut = 'Quad.easeOut',
    CubicEaseOut = 'Cubic.easeOut',
    QuartEaseOut = 'Quart.easeOut',
    QuintEaseOut = 'Quint.easeOut',
    SineEaseOut = 'Sine.easeOut',
    ExpoEaseOut = 'Expo.easeOut',
    CircEaseOut = 'Circ.easeOut',
    BackEaseOut = 'Back.easeOut',
    BounceEaseOut = 'Bounce.easeOut',
    QuadEaseInOut = 'Quad.easeInOut',
    CubicEaseInOut = 'Cubic.easeInOut',
    QuartEaseInOut = 'Quart.easeInOut',
    QuintEaseInOut = 'Quint.easeInOut',
    SineEaseInOut = 'Sine.easeInOut',
    ExpoEaseInOut = 'Expo.easeInOut',
    CircEaseInOut = 'Circ.easeInOut',
    BackEaseInOut = 'Back.easeInOut',
    BounceEaseInOut = 'Bounce.easeInOut',
}
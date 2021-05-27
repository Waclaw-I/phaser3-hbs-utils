export declare type CopyWithPartial<T, K extends keyof T> = {
    [P in K]?: T[P];
};
export interface KeyFrame {
    key: string;
    frame?: string | number;
}
export interface Point {
    x: number;
    y: number;
}
export declare enum Easing {
    Linear = "Linear",
    QuadEaseIn = "Quad.easeIn",
    CubicEaseIn = "Cubic.easeIn",
    QuartEaseIn = "Quart.easeIn",
    QuintEaseIn = "Quint.easeIn",
    SineEaseIn = "Sine.easeIn",
    ExpoEaseIn = "Expo.easeIn",
    CircEaseIn = "Circ.easeIn",
    BackEaseIn = "Back.easeIn",
    BounceEaseIn = "Bounce.easeIn",
    QuadEaseOut = "Quad.easeOut",
    CubicEaseOut = "Cubic.easeOut",
    QuartEaseOut = "Quart.easeOut",
    QuintEaseOut = "Quint.easeOut",
    SineEaseOut = "Sine.easeOut",
    ExpoEaseOut = "Expo.easeOut",
    CircEaseOut = "Circ.easeOut",
    BackEaseOut = "Back.easeOut",
    BounceEaseOut = "Bounce.easeOut",
    QuadEaseInOut = "Quad.easeInOut",
    CubicEaseInOut = "Cubic.easeInOut",
    QuartEaseInOut = "Quart.easeInOut",
    QuintEaseInOut = "Quint.easeInOut",
    SineEaseInOut = "Sine.easeInOut",
    ExpoEaseInOut = "Expo.easeInOut",
    CircEaseInOut = "Circ.easeInOut",
    BackEaseInOut = "Back.easeInOut",
    BounceEaseInOut = "Bounce.easeInOut"
}

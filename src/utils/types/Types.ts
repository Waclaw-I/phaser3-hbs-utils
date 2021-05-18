
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
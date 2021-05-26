import { Point } from '../../types/Types';

export type IconTextTextConfig = Omit<Phaser.Types.GameObjects.BitmapText.BitmapTextConfig, 'origin'>;
export type IconTextImageConfig = Omit<Phaser.Types.GameObjects.Sprite.SpriteConfig, 'origin'>;

export interface IconTextConfig {
    x: number;
    y: number;
    textConfig: IconTextTextConfig;
    imageConfig: IconTextImageConfig;
    textFirst: boolean;
    centered?: boolean;
    spacing?: number;
    vertical?: boolean;
    changeCursorIcon?: boolean;
}

export enum IconTextEvent {
    Clicked = 'Clicked',
}

/**
 * TODO: Create one generic method to reposition icon and text based on flags: centered, textFirst, vertical
 *       and call it every time icon or text was changed
 */
export class IconText extends Phaser.GameObjects.Container {

    protected iconImage: Phaser.GameObjects.Image;
    protected text: Phaser.GameObjects.BitmapText;

    protected config: IconTextConfig;

    constructor(scene: Phaser.Scene, config: IconTextConfig) {
        super(scene, config.x, config.y);
        this.config = config;

        this.iconImage = this.scene.make.image({
            ...this.config.imageConfig,
        });

        const textPositionShift = this.iconImage.displayWidth * 0.5 + (config.spacing ?? 0);
        const textX = (config.textFirst ? -textPositionShift : textPositionShift);

        this.text = this.scene.make.bitmapText({
            ...this.config.textConfig,
            x: this.textOffset.x + textX,
            y: this.textOffset.y,
        })
            .setOrigin(config.textFirst ? 1 : 0, 0.5);

        if (config.vertical) {
            this.handleVerticalPlacement();
        } else {
            if (config.centered) {
                this.centralize();
            }
        }


        this.add([
            this.iconImage,
            this.text,
        ]);

        this.updateSize();
        this.bindEventHandlers();
        this.scene.add.existing(this);
    }

    public setIconTexture(key: string, frame?: string | number): this {
        this.iconImage.setTexture(key, frame);
        return this;
    }

    public setIconScale(x: number, y?: number | undefined): void {
        this.iconImage.setScale(x, y);

        if (this.config.vertical) {
            this.handleVerticalPlacement();
        } else {
            if (this.config.centered) {
                this.centralize()
            } else {
                const textPositionShift = this.iconImage.displayWidth * 0.5 + (this.config.spacing ?? 0);
                this.text.x = this.textOffset.x + (this.config.textFirst ? -textPositionShift : textPositionShift);
            }
        }
        this.updateSize();

    }

    public setTextTint(value: number): IconText {
        this.text.setTint(value);
        return this;
    }

    public clearTextTint(): void {
        this.text.clearTint();
    }

    public setTint(value: number): IconText {
        this.iconImage.setTint(value);
        this.text.setTint(value);
        return this;
    }

    public clearTint(): void {
        this.iconImage.clearTint();
        this.text.clearTint();
    }

    public setIconFlipX(value: boolean): IconText {
        this.iconImage.setFlipX(value);
        return this;
    }

    public setIconFlipY(value: boolean): IconText {
        this.iconImage.setFlipY(value);
        return this;
    }

    public setText(text: string | number): void {
        this.text.setText(text.toString());
        if (this.config.centered && !this.config.vertical) {
            this.centralize();
        }
        this.updateSize();
    }

    public getText(): string {
        return this.text.text;
    }

    private bindEventHandlers(): void {
        this.on('pointerup', () => {
            this.emit(IconTextEvent.Clicked);
        });
    }

    private updateSize(): void {
        const spacing = this.config.spacing ?? 0;
        const width = this.text.width + spacing + this.iconImage.displayWidth;
        const height = Math.max(this.text.height, this.iconImage.displayHeight);
        const x = Math.min(this.text.x - (this.text.width * this.text.originX), this.iconImage.getLeftCenter().x);
        const y = 0;
        if (!this.input?.hitArea) {
            this.setInteractive({
                hitArea: new Phaser.Geom.Rectangle(x + width / 2, y, width, height),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                cursor: this.config.changeCursorIcon ? "pointer" : '',
            });
        } else {
            // NOTE: Description says we position from top-left, but it works only for positioning in middle.
            this.input.hitArea.setTo(x + width / 2, y, width, height);
        }

        this.setSize(width, height);
    }

    private handleVerticalPlacement(): void {
        this.text.setOrigin(0.5, this.config.textFirst ? 1 : 0);
        this.text.x = this.textOffset.x + this.iconImage.x;
        this.text.y = this.textOffset.y + (this.iconImage.displayHeight * 0.5 + this.spacing) * (this.config.textFirst ? -1 : 1);
    }

    private centralize(): void {
        const spacing = this.config.spacing || 0;
        const totalWidth = this.iconImage.displayWidth + this.text.width + spacing;
        const side = this.config.textFirst ? 1 : -1;
        this.iconImage.x = (totalWidth - this.iconImage.displayWidth) * 0.5 * side;
        this.text.x = this.iconImage.x - (this.iconImage.displayWidth * 0.5 + spacing) * side;
        // console.log(this.text.originX, this.iconImage.originX, this.iconImage.x, this.text.x);
    }

    private get textOffset(): Point {
        return {
            x: this.config.textConfig.x ?? 0,
            y: this.config.textConfig.y ?? 0,
        }
    }

    private get spacing(): number {
        return this.config.spacing ?? 0;
    }
}

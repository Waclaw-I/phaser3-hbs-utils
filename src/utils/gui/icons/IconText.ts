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

export class IconText extends Phaser.GameObjects.Container {

    protected iconImage: Phaser.GameObjects.Image;
    protected text: Phaser.GameObjects.BitmapText;

    protected config: IconTextConfig;

    constructor(scene: Phaser.Scene, config: IconTextConfig) {
        super(scene, config.x, config.y);
        this.config = config;

        this.iconImage = this.scene.make.image({...this.config.imageConfig});
        this.text = this.scene.make.bitmapText({...this.config.textConfig});

        this.add([
            this.iconImage,
            this.text,
        ]);

        this.repositionAfterChange();
        this.updateSize();
        this.bindEventHandlers();
        this.scene.add.existing(this);
    }

    public setIconTexture(key: string, frame?: string | number): this {
        this.iconImage.setTexture(key, frame);
        this.repositionAfterChange();
        this.updateSize();
        return this;
    }

    public setIconScale(x: number, y?: number | undefined): void {
        this.iconImage.setScale(x, y);
        this.repositionAfterChange();
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
        this.repositionAfterChange();
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
        const width = this.text.width + this.spacing + this.iconImage.displayWidth;
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

    private repositionAfterChange(): void {
        this.text.setPosition(this.textOffset.x, this.textOffset.y);
        this.iconImage.setPosition(this.imageOffset.x, this.imageOffset.y);
        const side = this.config.textFirst ? 1 : -1;
        
        if (this.config.vertical) {
            this.text.setOrigin(0.5, this.config.textFirst ? 1 : 0);
            const halfImageHeight = this.iconImage.displayHeight * 0.5;
            this.text.x = this.iconImage.x;
            this.text.y = (halfImageHeight + this.spacing) * (this.config.textFirst ? -1 : 1);

            if (this.config.centered) {
                const totalHeight = this.iconImage.displayHeight + this.text.height + this.spacing;
                this.iconImage.y = (totalHeight - this.iconImage.displayHeight) * 0.5 * side;
                this.text.y = this.iconImage.y - (this.iconImage.displayHeight * 0.5 + this.spacing) * side;
                return;
            }
            return;
        }
        this.text.setOrigin(this.config.textFirst ? 1 : 0, 0.5);
        if (this.config.centered) {
            const totalWidth = this.iconImage.displayWidth + this.text.width + this.spacing;
            this.iconImage.x = (totalWidth - this.iconImage.displayWidth) * 0.5 * side;
            this.text.x = this.iconImage.x - (this.iconImage.displayWidth * 0.5 + this.spacing) * side;
            return;
        }

        this.text.x = this.iconImage.x - (this.iconImage.displayWidth * 0.5 + this.spacing) * side;
    }

    //TODO: Get rid of casting
    private get textOffset(): Point {
        return {
            x: <number>this.config.textConfig.x ?? 0,
            y: <number>this.config.textConfig.y ?? 0,
        }
    }

    private get imageOffset(): Point {
        return {
            x: <number>this.config.imageConfig.x ?? 0,
            y: <number>this.config.imageConfig.y ?? 0,
        }
    }

    private get spacing(): number {
        return this.config.spacing ?? 0;
    }
}

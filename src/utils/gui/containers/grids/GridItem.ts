import { Point } from '../../../types/Types';

export abstract class GridItem extends Phaser.GameObjects.Container {
    
    protected id: string;
    protected lastDragValueX: number;
    protected lastDragValueY: number;

    protected isBeingDragged: boolean;
    protected pointerWasDownOnThisItem: boolean;

    constructor(scene: Phaser.Scene, id: string) {
        super(scene, 0, 0);
        // NOTE: Should id be mandatory?
        this.id = id;

        this.lastDragValueX = 0;
        this.lastDragValueY = 0;

        this.isBeingDragged = false;
        this.pointerWasDownOnThisItem = false;

        this.scene.add.existing(this);
    }

    public abstract getDimensions(): Point;
    /**
     * Return type is being overriden in subclasses
     */
    public abstract getContentData(): any;

    public getId(): string { return this.id; }
    public setId(id: string): void { this.id = id; }

    protected handleDrag(dragX: number, dragY: number): void {
        this.isBeingDragged = true;
        this.emit('dragX', this.lastDragValueX - dragX);
        this.emit('dragY', this.lastDragValueY - dragY);

        this.lastDragValueX = dragX;
        this.lastDragValueY = dragY;
    }

    protected bindEventHandlers(): void {
        this.on('pointerdown', () => {
            this.pointerWasDownOnThisItem = true;
        });
        this.on('pointerout', () => {
            this.pointerWasDownOnThisItem = false;
        });
        this.on('pointerup', () => {
            if (this.isBeingDragged || !this.pointerWasDownOnThisItem) {
                return;
            }
            this.pointerWasDownOnThisItem = false;
            this.emit('clicked');
        });

        this.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            this.handleDrag(dragX - this.x, dragY - this.y);
        });

        this.on('dragend', () => {
            // NOTE: hack to set isBeingDragged value AFTER pointerup event.
            window.setTimeout(() => { this.isBeingDragged = false; });
            this.lastDragValueX = 0;
            this.lastDragValueY = 0;
        });
    }
}

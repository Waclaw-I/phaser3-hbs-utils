import { Point } from '../../../types/Types';

export enum GridItemEvent {
    Clicked = 'Clicked',
    Hold = 'Hold',
}

// TODO: CHANGE TO ABSTRACT CLASS
export class GridItem extends Phaser.GameObjects.Container {

    protected id: string | undefined;
    protected lastDragValueX: number;
    protected lastDragValueY: number;

    protected isBeingDragged: boolean;
    protected pointerWasDownOnThisItem: boolean;

    protected holdTimeout: number | undefined;

    private static TIME_FOR_HOLD: number = 1000;

    constructor(scene: Phaser.Scene, id?: string, position?: Point) {
        super(scene, position?.x ?? 0, position?.y ?? 0);
        this.id = id;

        this.lastDragValueX = 0;
        this.lastDragValueY = 0;

        this.isBeingDragged = false;
        this.pointerWasDownOnThisItem = false;
        this.holdTimeout = undefined;

        this.scene.add.existing(this);
    }

    public static getDimensions(): any {
    // public static getDimensions(): Point {
        // throw new MethodNotImplementedError();
    }

    public getContentData(): any {
        // throw new MethodNotImplementedError();
    }

    public getId(): string | undefined { return this.id; }

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
            this.holdTimeout = window.setTimeout(
                () => {
                    this.emit(GridItemEvent.Hold);
                },
                GridItem.TIME_FOR_HOLD,
            );

        });
        this.on('pointerout', () => {
            this.pointerWasDownOnThisItem = false;
        });
        this.on('pointerup', () => {
            this.clearHoldTimeout();
            if (this.isBeingDragged || !this.pointerWasDownOnThisItem) {
                return;
            }
            this.pointerWasDownOnThisItem = false;
            this.emit(GridItemEvent.Clicked);
        });

        this.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            this.clearHoldTimeout();
            this.handleDrag(dragX - this.x, dragY - this.y);
        });

        this.on('dragend', () => {
            // NOTE: Little trick to set isBeingDragged value AFTER pointerup event.
            window.setTimeout(() => { this.isBeingDragged = false; });
            this.lastDragValueX = 0;
            this.lastDragValueY = 0;
        });
    }

    private clearHoldTimeout(): void {
        if (this.holdTimeout) {
            window.clearTimeout(this.holdTimeout);
            this.holdTimeout = undefined;
        }
    }
}

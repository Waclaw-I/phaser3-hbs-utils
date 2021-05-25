import { CircularBuffer } from '../../dataStructures/CircularBuffer';
import { MathHelper } from '../../helpers/MathHelper';
import { Easing, Point } from '../../types/Types';

export enum DragBoxEvent {
    ScrollProgressVertical = 'scrollProgressVertical',
    ScrollProgressHorizontal = 'scrollProgressHorizontal',
}

export interface DragBoxContent {
    x: number;
    y: number;
    displayWidth: number;
    displayHeight: number;
    on: Function;
}

export interface DragBoxConfig {
    position: Point;
    width: number;
    height: number;
    content: DragBoxContent;
    horizontal?: boolean;
    repositionToCenter?: boolean;
    maskPosition?: Point;
    debug?: {
        showDraggableSpace: boolean;
        color?: number;
        alpha?: number;
    };
}

export class DragBox extends Phaser.GameObjects.Container {

    private draggableSpace: Phaser.GameObjects.Rectangle;
    private content: DragBoxContent;
    private myMask: Phaser.Display.Masks.GeometryMask;

    private draggableSpaceBottom: number;
    private draggableSpaceTop: number;
    private draggableSpaceLeft: number;
    private draggableSpaceRight: number;
    private lastDragValueVertical: number;
    private lastDragValueHorizontal: number;
    private dragForceVertical: number;
    private dragForceHorizontal: number;
    private mostRecentDragValuesVertical: CircularBuffer<number>;
    private mostRecentDragValuesHorizontal: CircularBuffer<number>;

    private isDraggable: boolean;

    private config: DragBoxConfig;

    /**
     * Container provided as a content MUST have its size set!
     */
    constructor(scene: Phaser.Scene, config: DragBoxConfig) {
        super(scene, config.position.x, config.position.y);
        this.config = config;

        this.lastDragValueVertical = 0;
        this.lastDragValueHorizontal = 0;
        this.dragForceVertical = 0;
        this.dragForceHorizontal = 0;
        const bufferSize = 10;
        this.mostRecentDragValuesVertical = new CircularBuffer<number>(bufferSize);
        this.mostRecentDragValuesHorizontal = new CircularBuffer<number>(bufferSize);

        this.isDraggable = true;

        this.initializeDraggableSpace();

        this.content = config.content;
        this.updateMask();

        this.add([
            this.draggableSpace,
            this.content,
        ]);

        this.setSize(this.draggableSpace.width, this.draggableSpace.height);

        this.moveContentToBeginning();

        this.scene.add.existing(this);

        this.bindEventHandlers();
    }

    public preUpdate(): void {
        if (this.isDraggable) {
            if (this.config.horizontal) {
                if (this.dragForceHorizontal !== 0) {
                    this.dragContentHorizontallyByValue(this.dragForceHorizontal);
                    this.dragForceHorizontal = this.updateDragForce(this.dragForceHorizontal);
                    this.emit(DragBoxEvent.ScrollProgressHorizontal, this.getScrollProgressHorizontal());
                }
            } else if (this.dragForceVertical !== 0) {
                this.dragContentVerticallyByValue(this.dragForceVertical);
                this.dragForceVertical = this.updateDragForce(this.dragForceVertical);
                this.emit(DragBoxEvent.ScrollProgressVertical, this.getScrollProgressVertical());
            }

            // TODO: should we push 0 only when DRAGGING state and when NO DRAG EVENT is coming in?
            this.mostRecentDragValuesHorizontal.push(0);
            this.mostRecentDragValuesVertical.push(0);
        }
    }

    public enableDrag(enable: boolean = true): void {
        if (this.isDraggable === enable) {
            return;
        }

        if (!enable) {
            this.stopDragForce();
        }

        this.scene.input.setDraggable(this.draggableSpace, enable);
        this.isDraggable = enable;
    }

    public moveContentToBeginning(): void {
        if (this.config.horizontal) {
            this.content.x = this.draggableSpaceLeft;
            return;
        }
        this.content.y = this.draggableSpaceTop;
    }

    public async moveContentTo(progress: number, duration: number = 0): Promise<void> {
        const clampedProgress = Phaser.Math.Clamp(progress, 0, 1);
        // TODO: Add horizontal
        const heightDifference = this.content.displayHeight - this.draggableSpace.displayHeight;
        const targetPosition = this.draggableSpaceTop - (clampedProgress * heightDifference);

        if (duration === 0) {
            if (this.config.horizontal) {
                this.content.x = targetPosition;
                this.emit(DragBoxEvent.ScrollProgressHorizontal, clampedProgress);
            } else {
                this.content.y = targetPosition;
                this.emit(DragBoxEvent.ScrollProgressVertical, clampedProgress);
            }
            return;
        }
        await this.moveContentToAnimation(targetPosition, duration);
    }

    private async moveContentToAnimation(targetPosition: number, duration: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.scene.tweens.addCounter({
                duration,
                from: this.config.horizontal ? this.content.x : this.content.y,
                to: targetPosition,
                ease: Easing.BackEaseOut,
                onUpdate: (tween: Phaser.Tweens.Tween) => {
                    if (this.config.horizontal) {
                        this.content.x = tween.getValue();
                        this.emit(DragBoxEvent.ScrollProgressHorizontal, this.getScrollProgressHorizontal());
                    } else {
                        this.content.y = tween.getValue();
                        this.emit(DragBoxEvent.ScrollProgressVertical, this.getScrollProgressVertical());
                    }
                },
                onComplete: () => {
                    resolve();
                },
            });
        });
    }

    public moveContentBy(moveBy: number, duration: number, easing?: Easing): void {
        if (moveBy === 0) {
            return;
        }
        let from = 0;
        let to = 0;

        if (this.config.horizontal) {
            from = this.content.x;
            to = this.content.x - moveBy;
            if (moveBy > 0 && !this.canDragLeft(moveBy)) {
                to = this.draggableSpaceLeft;
            }
            if (moveBy < 0 && !this.canDragRight(moveBy)) {
                to = this.draggableSpaceRight +  - this.content.displayWidth;
            }
        } else {
            from = this.content.y;
            to = this.content.y - moveBy;
            if (moveBy > 0 && !this.canDragDown(moveBy)) {
                to = this.draggableSpaceBottom - this.content.displayHeight;
            }
            if (moveBy < 0 && !this.canDragUp(moveBy)) {
                to = this.draggableSpaceTop;
            }
        }

        const tween = this.scene.tweens.addCounter({
            duration,
            from,
            to,
            ease: easing ?? Easing.BackEaseOut,
            onUpdate: () => {
                if (this.config.horizontal) {
                    this.content.x = tween.getValue();
                    this.emit(DragBoxEvent.ScrollProgressHorizontal, this.getScrollProgressHorizontal());
                } else {
                    this.content.y = tween.getValue();
                    this.emit(DragBoxEvent.ScrollProgressVertical, this.getScrollProgressVertical());
                }
            },
        });
    }

    public stopDragForce(): void {
        if (this.dragForceVertical !== 0) {
            this.dragForceVertical = 0;
            this.lastDragValueVertical = 0;
            this.mostRecentDragValuesVertical.clear();
        }
        if (this.dragForceHorizontal !== 0) {
            this.dragForceHorizontal = 0;
            this.lastDragValueHorizontal = 0;
            this.mostRecentDragValuesHorizontal.clear();
        }
    }

    public changeDraggableSpacePosAndSize(position: Point, dimensions: Point, maskPosition: Point): void {
        this.setPosition(position.x, position.y);
        this.draggableSpace.displayWidth = dimensions.x;
        this.draggableSpace.displayHeight = dimensions.y;
        this.updateDraggableSpaceEdges();
        this.draggableSpace.setInteractive();
        this.updateMask(maskPosition);
    }

    protected repositionContent(): void {
        if (this.config.repositionToCenter) {
            if (this.config.horizontal) {
                this.content.y = this.draggableSpace.y - this.content.displayHeight * 0.5;
            } else {
                this.content.x = this.draggableSpace.x - this.content.displayWidth * 0.5;
            }
            return;
        }
        this.content.x = this.draggableSpaceLeft;
        this.content.y = this.draggableSpaceTop;
    }

    private updateDragForce(dragForce: number): number {
        if (Math.abs(dragForce) < 0.05) {
            return 0;
        }
        if (Math.abs(dragForce) < 1) {
            return dragForce * 0.5;
        }
        return dragForce * 0.98;
    }

    private updateMask(maskPosition?: Point): void {
        this.clearMask();
        this.myMask?.geometryMask?.destroy();
        this.myMask?.destroy();
        this.myMask = this.createMask(maskPosition);
        this.setMask(this.myMask);
    }

    private createMask(maskPosition?: Point): Phaser.Display.Masks.GeometryMask {
        let x = this.x - (this.draggableSpace.displayWidth / 2);
        let y = this.y - (this.draggableSpace.displayHeight / 2);

        const maskPos = maskPosition ?? this.config.maskPosition;
        if (maskPos) {
            x = maskPos.x - (this.draggableSpace.displayWidth / 2);
            y = maskPos.y - (this.draggableSpace.displayHeight / 2);
        }
        const maskShape =
            this.scene.make.graphics({ fillStyle: { color: 0xffff00, alpha: 0.5 }, add: false })
                .fillRect(
                    x,
                    y,
                    this.draggableSpace.displayWidth,
                    this.draggableSpace.displayHeight,
                );

        return new Phaser.Display.Masks.GeometryMask(this.scene, maskShape);
    }

    private initializeDraggableSpace(): void {
        this.draggableSpace = this.scene.add.rectangle(
            0,
            0,
            this.config.width,
            this.config.height,
            this.config.debug?.color ?? 0x00ff00,
            this.config.debug?.showDraggableSpace ? (this.config.debug.alpha ?? 0.5) : 0);
        this.updateDraggableSpaceEdges();
        this.draggableSpace.setInteractive();
        this.scene.input.setDraggable(this.draggableSpace);
    }

    private updateDraggableSpaceEdges(): void {
        this.draggableSpaceBottom = this.draggableSpace.y + this.draggableSpace.displayHeight / 2;
        this.draggableSpaceTop = this.draggableSpace.y - this.draggableSpace.displayHeight / 2;
        this.draggableSpaceLeft = this.draggableSpace.x - this.draggableSpace.displayWidth / 2;
        this.draggableSpaceRight = this.draggableSpace.x + this.draggableSpace.displayWidth / 2;
    }

    private handleDragY(dragY: number): void {
        if (!this.isDraggableVertically()) {
            return;
        }
        if (this.dragForceVertical !== 0) {
            this.stopDragForce();
        }
        this.mostRecentDragValuesVertical.push(dragY);
        this.dragContentVerticallyByValue(dragY);
        this.emit(DragBoxEvent.ScrollProgressVertical, this.getScrollProgressVertical());
    }

    private handleDragX(dragX: number): void {
        if (!this.isDraggableHorizontally()) {
            return;
        }
        if (this.dragForceHorizontal !== 0) {
            this.stopDragForce();
        }
        this.mostRecentDragValuesHorizontal.push(dragX);
        this.dragContentHorizontallyByValue(dragX);
        this.emit(DragBoxEvent.ScrollProgressHorizontal, this.getScrollProgressHorizontal());
    }

    private handleDragend(): void {
        if (!this.isDraggableVertically() && !this.isDraggableHorizontally()) {
            return;
        }
        if (this.config.horizontal) {
            const meanDragValueHorizontal = this.getMeanDragValueHorizontal();
            if (Math.abs(meanDragValueHorizontal) > 1.5) {
                this.dragForceHorizontal = meanDragValueHorizontal;
            }
            if (Math.abs(meanDragValueHorizontal) > 10) {
                this.dragForceHorizontal = meanDragValueHorizontal * 3; // boost for aggresive swipes
            }
            this.lastDragValueHorizontal = 0;
        } else {
            const meanDragValueVertical = this.getMeanDragValueVertical();
            if (Math.abs(meanDragValueVertical) > 1.5) {
                this.dragForceVertical = meanDragValueVertical;
            }
            if (Math.abs(meanDragValueVertical) > 10) {
                this.dragForceVertical = meanDragValueVertical * 3; // boost for aggresive swipes
            }
            this.lastDragValueVertical = 0;
        }
    }

    private dragWithWheel(dx: number, dy: number): void {
        if (this.isDraggableVertically()) {
            this.stopDragForce();
            this.moveContentBy(250 * (dy > 0 ? 1 : -1), 250, Easing.ExpoEaseOut);
        }
    }

    private bindContentHandlers(): void {
        this.content.on('dragX', (dragX: number) => {
            if (this.isDraggable) {
                this.handleDragX(dragX);
                this.emit('dragX', dragX);
            }
        });
        this.content.on('dragY', (dragY: number) => {
            if (this.isDraggable) {
                this.handleDragY(dragY);
                this.emit('dragY', dragY);
            }
        });
        this.content.on('dragend', () => {
            if (this.isDraggable) {
                this.handleDragend();
                this.emit('dragend');
            }
        });
        this.content.on('pointerdown', () => {
            this.stopDragForce();
        });
        this.content.on('wheel', (pointer: Phaser.Input.Pointer, dx: number, dy: number, dz: number) => {
            this.dragWithWheel(dx, dy);
        });
    }

    private bindEventHandlers(): void {
        this.bindContentHandlers();
        this.draggableSpace.on('pointerdown', () => {
            if (!this.isDraggableVertically() && !this.isDraggableHorizontally()) {
                return;
            }
            this.stopDragForce();
        });
        this.draggableSpace.on('wheel', (pointer: Phaser.Input.Pointer, dx: number, dy: number, dz: number) => {
            this.dragWithWheel(dx, dy);
        });
        // TODO: Probably little tweak is needed. We changed drag amounts from items
        this.draggableSpace.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            if (this.isDraggableHorizontally()) {
                const dragByHorizontal = this.lastDragValueHorizontal - dragX;
                this.lastDragValueHorizontal = dragX;
                this.handleDragX(dragByHorizontal);
            } else if (this.isDraggableVertically()) {
                const dragByVertical = this.lastDragValueVertical - dragY;
                this.lastDragValueVertical = dragY;
                this.handleDragY(dragByVertical);
            }
        });

        this.draggableSpace.on('dragend', () => {
            this.handleDragend();
        });
    }

    public getScrollProgressVertical(): number {
        const heightDifference = this.content.displayHeight - this.draggableSpace.displayHeight;
        return (this.draggableSpaceTop - this.content.y) / heightDifference;
    }

    public getScrollProgressHorizontal(): number {
        const widthDifference = this.content.displayWidth - this.draggableSpace.displayWidth;
        return (this.draggableSpaceLeft - this.content.x) / widthDifference;
    }

    private dragContentVerticallyByValue(dragBy: number): void {
        if (dragBy > 0) { // scroll down
            if (!this.canDragDown(dragBy)) {
                this.content.y = this.draggableSpaceBottom - this.content.displayHeight;
                this.stopDragForce();
                return;
            }
        }
        if (dragBy < 0) { // scroll up
            if (!this.canDragUp(dragBy)) {
                this.content.y = this.draggableSpaceTop;
                this.stopDragForce();
                return;
            }
        }
        this.content.y -= dragBy;
    }

    private dragContentHorizontallyByValue(dragBy: number): void {
        if (dragBy > 0) { // scroll right
            if (!this.canDragRight(dragBy)) {
                this.content.x = this.draggableSpaceRight - this.content.displayWidth;
                this.stopDragForce();
                return;
            }
        }
        if (dragBy < 0) { // scroll left
            if (!this.canDragLeft(dragBy)) {
                this.content.x = this.draggableSpaceLeft;
                this.stopDragForce();
                return;
            }
        }
        this.content.x -= dragBy;
    }

    private canDragLeft(dragBy: number = 0): boolean {
        return !(this.content.x - dragBy >= this.draggableSpaceLeft);
    }

    private canDragRight(dragBy: number = 0): boolean {
        return !(this.content.x + this.content.displayWidth - dragBy <= this.draggableSpaceRight);
    }

    private canDragUp(dragBy: number = 0): boolean {
        return !(this.content.y - dragBy >= this.draggableSpaceTop);
    }

    private canDragDown(dragBy: number = 0): boolean {
        return !(this.content.y + this.content.displayHeight - dragBy <= this.draggableSpaceBottom);
    }

    private getMeanDragValueVertical(): number {
        return MathHelper.toFixedNumber(
            MathHelper.sum(this.mostRecentDragValuesVertical.getAll()) / this.mostRecentDragValuesVertical.size);
    }

    private getMeanDragValueHorizontal(): number {
        return MathHelper.toFixedNumber(
            MathHelper.sum(this.mostRecentDragValuesHorizontal.getAll()) / this.mostRecentDragValuesHorizontal.size);
    }

    public isDraggableVertically(): boolean {
        if (this.config.horizontal || !this.isDraggable) {
            return false;
        }
        return this.draggableSpace.displayHeight < this.content.displayHeight;
    }

    public isDraggableHorizontally(): boolean {
        if (!this.config.horizontal || !this.isDraggable) {
            return false;
        }
        return this.draggableSpace.displayWidth < this.content.displayWidth;
    }

    public getVisibleVerticalSpaceRatioToContent(): number {
        return this.draggableSpace.displayHeight / this.content.displayHeight;
    }

    public getVisibleHorizontalSpaceRatioToContent(): number {
        return this.draggableSpace.displayWidth / this.content.displayWidth;
    }

    public getMyMask(): Phaser.Display.Masks.GeometryMask {
        return this.myMask;
    }
}

import { Point } from '../../../types/Types';
import { GridItem, GridItemEvent } from './GridItem';

export enum GridEvent {
    Clicked = 'Clicked',
    ItemClicked = 'ItemClicked',
    ItemHold = 'ItemHold',
    Wheel = 'Wheel',

}

export interface GridConfig {
    position: Point;
    itemsInRow?: number;
    horizontal?: boolean;
    spacing?: number;
}

// TODO: some sort of stop bumpers at the end? locking list with whole visible fields?
// TODO: Future tweaks, slight refactor?
// TODO: Pass dragY further if end/top of the list was reached
export class Grid extends Phaser.GameObjects.Container {

    private items: GridItem[];
    private config: GridConfig;

    private spacing: number;

    private itemsInRow: number;
    private horizontal: boolean;

    constructor(scene: Phaser.Scene, config: GridConfig) {
        super(scene, config.position.x, config.position.y);

        this.config = config;
        this.itemsInRow = config.itemsInRow || 1;
        this.horizontal = config.horizontal || false;

        this.spacing = config.spacing || 0;

        this.items = [];

        this.scene.add.existing(this);
    }

    public clearAllItems(): void {
        for (const item of this.items) {
            item.destroy(); // TODO: Use some nice pool if lagging
        }
        this.items = [];
        this.setSize(0, 0);
    }

    public removeItem(id: string): boolean {
        const index = this.getItemIndexOfId(id);
        if (index === -1) {
            return false;
        }
        const itemToBeRemoved = this.items[index];
        this.switchItemsPositionsUpToIndex(index);
        this.items.splice(index, 1);
        itemToBeRemoved.destroy();
        this.updateSize();
        return true;
    }

    public setItemAtGivenIndex(itemId: string, index: number): boolean {
        const itemToPlace = this.getItemOfId(itemId);
        const itemOnDesiredPosition = this.items[index];

        if (!itemToPlace || !itemOnDesiredPosition) {
            return false;
        }
        return this.swapItemsPositions(itemToPlace, itemOnDesiredPosition);
    }

    public swapItemsPositions(firstItem: GridItem, secondItem: GridItem): boolean {
        if (firstItem === secondItem) {
            return true;
        }
        if (!firstItem || !secondItem) {
            return false;
        }

        const firstItemId = firstItem.getId();
        const secondItemId = secondItem.getId();

        if (!firstItemId || !secondItemId) {
            return false;
        }

        const firstItemPos = { x: firstItem.x, y: firstItem.y };
        firstItem.setPosition(secondItem.x, secondItem.y);
        secondItem.setPosition(firstItemPos.x, firstItemPos.y);

        const firstItemIndex = this.getItemIndexOfId(firstItemId);
        const secondItemIndex = this.getItemIndexOfId(secondItemId);

        const temp = firstItem;
        this.items[firstItemIndex] = secondItem;
        this.items[secondItemIndex] = temp;

        return true;
    }

    public addItem(item: GridItem): void {

        this.items.push(item);
        this.add(item);
        this.registerItemEvents(item);

        // TODO: THIS IS WORKING BAD IF ONLY 1 ITEM VISIBLE?
        if (this.items.length === 1) {
            item.y = item.displayHeight * 0.5;
            item.x = item.displayWidth * 0.5;
            this.setSize(item.displayWidth, item.displayHeight);
            return;
        }

        if (this.horizontal) {
            const previousItem = this.items[this.items.length - 2];
            const itemIndex = this.items.length - 1;
            item.x = previousItem.x;
            if (itemIndex % this.itemsInRow === 0) { // next column
                item.x += (previousItem.displayWidth + item.displayWidth) * 0.5 + this.spacing;
                item.y = this.items[itemIndex - (this.itemsInRow)].y;
            } else {
                item.y += previousItem.y + (previousItem.displayHeight + item.displayHeight) * 0.5 + this.spacing;
            }
        } else {
            const previousItem = this.items[this.items.length - 2];
            const itemIndex = this.items.length - 1;
            item.y = previousItem.y;
            if (itemIndex % this.itemsInRow === 0) { // next row
                item.y += (previousItem.displayHeight + item.displayHeight) * 0.5 + this.spacing;
                item.x = this.items[itemIndex - (this.itemsInRow)].x;
            } else {
                item.x += previousItem.x + (previousItem.displayWidth + item.displayWidth) * 0.5 + this.spacing;
            }
        }
        this.updateSize();
    }

    public getItemOfIndex(index: number): GridItem | undefined {
        return this.items[index];
    }

    public getItemOfId(id: string): GridItem | undefined {
        return this.items[this.getItemIndexOfId(id)];
    }

    private getItemIndexOfId(id: string): number {
        return this.items.map(item => item.getId()).indexOf(id);
    }

    private switchItemsPositionsUpToIndex(index: number): void {
        for (let i = this.items.length - 1; i > index; i -= 1) {
            const prevItem = this.items[i - 1];
            this.items[i].setPosition(prevItem.x, prevItem.y);
        }
    }

    private updateSize(): void {
        let edgeLeft = Phaser.Math.MAX_SAFE_INTEGER;
        let edgeRight = 0;
        let edgeTop = Phaser.Math.MAX_SAFE_INTEGER;
        let edgeBottom = 0;

        for (const item of this.items) {
            edgeLeft = Math.min(edgeLeft, item.x - item.displayWidth * 0.5);
            edgeRight = Math.max(edgeRight, item.x + item.displayWidth * 0.5);
            edgeTop = Math.min(edgeTop, item.y - item.displayHeight * 0.5);
            edgeBottom = Math.max(edgeBottom, item.y + item.displayHeight * 0.5);
        }
        this.setSize(Math.abs(edgeLeft - edgeRight), Math.abs(edgeTop - edgeBottom));
    }

    private registerItemEvents(item: GridItem): void {
        item.on('dragend', () => {
            this.emit('dragend');
        });
        item.on('dragY', (dragY: number) => {
            this.emit('dragY', dragY);
        });
        item.on('dragX', (dragX: number) => {
            this.emit('dragX', dragX);
        });
        item.on('wheel', (pointer: Phaser.Input.Pointer, dx: number, dy: number, dz: number) => {
            this.emit('wheel', pointer, dx, dy, dz);
            this.emit(GridEvent.Wheel);
        });
        item.on(GridItemEvent.Clicked, () => {
            this.emit(GridEvent.Clicked);
            this.emit(GridEvent.ItemClicked, item);
        });
        item.on(GridItemEvent.Hold, () => {
            this.emit(GridEvent.ItemHold, item);
        });
        item.on('pointerdown', () => {
            this.emit('pointerdown');
        });
    }

    public getItems(): GridItem[] { return this.items; }

    public getHeight(): number { return this.displayHeight; }
}

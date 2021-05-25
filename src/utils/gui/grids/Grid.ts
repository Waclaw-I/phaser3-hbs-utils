import { Point } from '../../types/Types';
import { GridItem } from './GridItem';

export enum GridEvent {
    ItemClicked = 'ItemClicked',
    ItemDragged = 'ItemDragged',
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
export class Grid<T extends GridItem> extends Phaser.GameObjects.Container {

    private items: T[];
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

    public clearAllItems(destroy: boolean = true): void {
        this.remove(this.items, destroy);
        if (!destroy) {
            this.items.forEach(item => item.setVisible(false).setActive(false));
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

    public swapItemsPositions(firstItem: T, secondItem: T): boolean {
        if (firstItem === secondItem) {
            return true;
        }
        if (!firstItem || !secondItem) {
            return false;
        }

        const firstItemPos = { x: firstItem.x, y: firstItem.y };
        firstItem.setPosition(secondItem.x, secondItem.y);
        secondItem.setPosition(firstItemPos.x, firstItemPos.y);

        const firstItemIndex = this.getItemIndexOfId(firstItem.getId());
        const secondItemIndex = this.getItemIndexOfId(secondItem.getId());

        const temp = firstItem;
        this.items[firstItemIndex] = secondItem;
        this.items[secondItemIndex] = firstItem;

        return true;
    }

    public addItem(item: T): void {

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

    public getItemOfIndex(index: number): T | undefined {
        return this.items[index];
    }

    public getItemOfId(id: string): T | undefined {
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
        const bounds = this.getBounds();
        this.setSize(bounds.width, bounds.height);
    }

    private registerItemEvents(item: GridItem): void {
        item.on('dragend', () => {
            this.emit('dragend');
        });
        item.on('dragY', (dragY: number) => {
            this.emit('dragY', dragY);
            this.emit(GridEvent.ItemDragged, item);
        });
        item.on('dragX', (dragX: number) => {
            this.emit('dragX', dragX);
            this.emit(GridEvent.ItemDragged, item);
        });
        item.on('clicked', () => {
            this.emit('clicked');
            this.emit(GridEvent.ItemClicked, item);
        });
        item.on('pointerdown', () => {
            this.emit('pointerdown');
        });
        item.on('wheel', (pointer: Phaser.Input.Pointer, dx: number, dy: number, dz: number) => {
            this.emit('wheel', pointer, dx, dy, dz);
            this.emit(GridEvent.Wheel);
        });
    }

    public getItems(): T[] { return this.items; }

    public getHeight(): number { return this.displayHeight; }
}

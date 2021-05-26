import { Point } from '../../../types/Types';
import { DragBox } from '../DragBox';
import { Grid, GridEvent } from './Grid';
import { GridItem } from './GridItem';

export enum DraggableGridEvent {
    ItemClicked = 'itemClicked',
    ItemDragged = 'ItemDragged',
    Wheel = 'Wheel',
}

export interface DraggableGridConfig {
    position: Point;
    dimension: Point;
    horizontal: boolean;
    itemsInRow: number;
    spacing: number;
    repositionToCenter?: boolean;
    maskPosition?: Point;
    debug?: {
        showDraggableSpace: boolean;
        color?: number;
        alpha?: number;
    };
}

export class DraggableGrid<T extends GridItem> extends DragBox {

    protected grid: Grid<T>;

    private draggableGridConfig: DraggableGridConfig;

    constructor(scene: Phaser.Scene, draggableGridConfig: DraggableGridConfig) {

        const grid = new Grid<T>(scene, {
            position: { x: 0, y: 0 },
            itemsInRow: draggableGridConfig.itemsInRow,
            horizontal: draggableGridConfig.horizontal,
            spacing: draggableGridConfig.spacing,
        });

        super(scene, {
            position: draggableGridConfig.position,
            width: draggableGridConfig.dimension.x,
            height: draggableGridConfig.dimension.y,
            content: grid,
            repositionToCenter: draggableGridConfig.repositionToCenter,
            horizontal: draggableGridConfig.horizontal,
            maskPosition: draggableGridConfig.maskPosition,
            debug: draggableGridConfig.debug,
        });

        this.draggableGridConfig = draggableGridConfig;
        this.grid = grid;

        this.bindGridEventHandlers();
    }

    public setItemAtGivenIndex(itemId: string, index: number): boolean {
        return this.grid.setItemAtGivenIndex(itemId, index);
    }

    public addItem(item: T, repositionContent?: boolean): void {
        this.grid.addItem(item);
        if (repositionContent) {
            this.repositionContent();
        }
    }

    public getAllItems(): T[] {
        return this.grid.getItems();
    }

    public getItemOfId(id: string): T | undefined {
        return this.grid.getItemOfId(id);
    }

    public clearAllItems(destroy: boolean = true): void {
        this.grid.clearAllItems(destroy);
    }

    public removeItem(id: string): boolean {
        return this.grid.removeItem(id);
    }

    public isHorizontal(): boolean {
        return this.draggableGridConfig.horizontal;
    }

    public getItemsInRowCount(): number {
        return this.draggableGridConfig.itemsInRow;
    }

    /**
     * Get count of whole visible items in the on row of the grid
     */
    public getHorizontallyVisibleItemsInRowCount(itemWidth: number): number {
        if (!this.draggableGridConfig.horizontal) {
            return this.draggableGridConfig.itemsInRow;
        }
        return Math.floor(this.getHorizontallyVisibleItemsInRowTotalValue(itemWidth));
    }

    /**
     * On differente devices grid items may stack differently. We want to know how much the last item is visible
     */
    public getLastHorizontallyVisibleItemFraction(itemWidth: number): number {
        if (!this.draggableGridConfig.horizontal) {
            return 0;
        }
        return this.getHorizontallyVisibleItemsInRowTotalValue(itemWidth) % 1;
    }

    /**
     * Total value means values like 4.42 (4 whole items and less than a half of the next one visible, horizontally)
     * Spacing included.
     */
    private getHorizontallyVisibleItemsInRowTotalValue(itemWidth: number): number {
        const spacing = this.draggableGridConfig.spacing;
        const availableSpace = this.draggableGridConfig.dimension.x;
        return (spacing + availableSpace) / (spacing + itemWidth);
    }

    private bindGridEventHandlers(): void {
        this.grid.on(GridEvent.ItemClicked, (item: T) => {
            this.emit(DraggableGridEvent.ItemClicked, item);
        });
        this.grid.on(GridEvent.ItemDragged, (item: T) => {
            this.emit(DraggableGridEvent.ItemDragged, item);
        });
        this.grid.on(GridEvent.Wheel, (item: T) => {
            this.emit(DraggableGridEvent.Wheel, item);
        });
    }
}

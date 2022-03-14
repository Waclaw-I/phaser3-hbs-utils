import { Point } from '../../../types/Types';
import { DragBox } from '../DragBox';
import { Grid, GridEvent } from "./Grid";
import { GridItem } from "./GridItem";

export enum DraggableGridEvent {
    ItemClicked = 'ItemClicked',
    ItemHold = 'ItemHold',
    Wheel = 'Wheel',
}

export interface DraggableGridConfig {
    position: Point;
    dimension: Point;
    horizontal: boolean;
    itemsInRow: number;
    spacing: number;
    repositionToCenter?: boolean;
    margin?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    };
    maskPosition?: Point;
    debug?: {
        showDraggableSpace: boolean;
    };
}

// TODO: FROM HB-UTILS?
export class DraggableGrid extends DragBox {

    private grid: Grid;
    private draggableGridConfig: DraggableGridConfig;

    constructor(scene: Phaser.Scene, draggableGridConfig: DraggableGridConfig) {
        const grid = new Grid(scene, {
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
            margin: draggableGridConfig.margin,
            maskPosition: draggableGridConfig.maskPosition,
            debug: draggableGridConfig.debug,
        });

        this.draggableGridConfig = draggableGridConfig;
        this.grid = grid;
        this.bindGridEventHandlers();
    }

    public addItem(item: GridItem): void {
        this.grid.addItem(item);
        this.repositionContent();
    }

    public getAllItems(): GridItem[] {
        return this.grid.getItems();
    }

    public getItemOfId(id: string): GridItem | undefined {
        return this.grid.getItemOfId(id);
    }

    public clearAllItems(): void {
        this.grid.clearAllItems();
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

    public getGridPosition(): Point {
        return { x: this.grid.x, y: this.grid.y };
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
        this.grid.on(GridEvent.ItemClicked, (item: GridItem) => {
            this.emit(DraggableGridEvent.ItemClicked, item);
        });
        this.grid.on(GridEvent.ItemHold, (item: GridItem) => {
            this.emit(DraggableGridEvent.ItemHold, item);
        });
        this.grid.on(GridEvent.Wheel, (item: GridItem) => {
            this.emit(DraggableGridEvent.Wheel, item);
        });
    }
}

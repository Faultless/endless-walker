interface Cell {
    wall: boolean;
    occupied: boolean;

}

export default class Map {
    grid: Cell[][] = [];

    constructor(w: number, h: number) {
        this.grid = Array.from(Array(h), () => Array(w));


    }

    editTile(x: number, y: number, cellOptions?: Partial<Cell>) {
        this.grid[y][x] = {
            ...this.grid[y][x],
            ...cellOptions
        };
    }
}

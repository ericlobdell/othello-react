export default class Cell {
    row: number;
    col: number;
    player: number;
    isTarget: boolean;
    distance: number;
    isHit: boolean;
    isHighestScoring: boolean;
    pointValue: number;

    constructor( 
        row: number, 
        col: number, 
        player: number, 
        isTarget: boolean = false ) {
        this.row = row;
        this.col = col;
        this.player = player;
        this.isTarget = isTarget;
        this.distance = 0;
    }
}
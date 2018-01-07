export default class Move {

    row: number;
    col: number;
    player: number;
    pointValue: number;
    isHighestScoring: boolean;

    constructor( row: number, col: number, points: number, playerId: number, isHighestScoring: boolean = false ) {
        this.col = col;
        this.row = row;
        this.pointValue = points;
        this.player = playerId;
        this.isHighestScoring = isHighestScoring;
    }
}
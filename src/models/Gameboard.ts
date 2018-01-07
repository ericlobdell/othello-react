import Cell from './Cell';
import Move from './Move';
import Player from './Player';

export default class Gameboard {
    rows: Cell[][];
    moves: Move[];
    players: Player[];

    constructor( players: Player[]) {
        this.rows = [];
        this.moves = [];
        this.players = players;
    }

}
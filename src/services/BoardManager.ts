import Cell from '../models/Cell';
import Player from '../models/Player';
import Gameboard from '../models/Gameboard';

const BoardManager = new class Boardmanager {

    tryGetCell( row: number, col: number, gameBoard: Gameboard ) {
        return this.isValidMove( row, col ) ?
            gameBoard.rows[row][col] :
            null;
    }

    isValidMove( row: number, col: number ): boolean {
        return ( row > -1 && col > -1 ) && ( row < 8 && col < 8 );
    }

    getFlatGameBoard( gameBoard: Gameboard ): Cell[] {
        return Array.prototype.concat.apply( [], gameBoard.rows );
    }

    getEmptyCells( gameBoard: Gameboard ): Cell[] {
        return this.getFlatGameBoard( gameBoard )
            .filter( c  => c.player === 0 );
    }

    getPlayerCells( playerNumber: number, gameBoard: Gameboard ): Cell[] {
        return this.getFlatGameBoard( gameBoard )
            .filter( c => c.player === playerNumber );
    }

    getAdjacentCells( cell: Cell, gameBoard: Gameboard ): Cell[] {
        const above = this.tryGetCell( cell.row - 1, cell.col, gameBoard );
        const aboveRight = this.tryGetCell( cell.row - 1, cell.col + 1, gameBoard );
        const aboveLeft = this.tryGetCell( cell.row - 1, cell.col - 1, gameBoard );
        const left = this.tryGetCell( cell.row, cell.col - 1, gameBoard );
        const right = this.tryGetCell( cell.row, cell.col + 1, gameBoard );
        const below = this.tryGetCell( cell.row + 1, cell.col, gameBoard );
        const belowRight = this.tryGetCell( cell.row + 1, cell.col + 1, gameBoard );
        const belowLeft = this.tryGetCell( cell.row + 1, cell.col - 1, gameBoard );

        return [above, aboveRight, aboveLeft, left, right, below, belowRight, belowLeft]
            .filter( c => c !== null ) as Cell[];
    }

    getOpenAdjacentCells( cell: Cell, gameBoard: Gameboard ): Cell[] {
        return this.getAdjacentCells( cell, gameBoard )
            .filter( c => c.player === 0 );
    }

    // impure
    resetTargetCells( gameBoard: Gameboard ): void {
        this.getFlatGameBoard( gameBoard )
            .forEach( c => c.isTarget = false );
    }

    getInitialPlayer( row: number, col: number ): number {
        let playerNumber = 0;

        if ( ( row === 3 && col === 3 ) || ( row === 4 && col === 4 ) )
            playerNumber =  1;

        if ( ( row === 3 && col === 4 ) || ( row === 4 && col === 3 ) )
            playerNumber =  2;

        return playerNumber;

    }

    cellIsInitialTarget( row: number, col: number ): boolean {
        return ( row === 2 && col === 4 ) ||
            ( row === 3 && col === 5 ) ||
            ( row === 4 && col === 2 ) ||
            ( row === 5 && col === 3 );
    }

    getInitialGameBoard( players: Player[] ) {
        const gameBoard = new Gameboard( players );

        for ( let r = 0; r < 8; r++ ) {
            const row: Cell[] = [];

            for ( let c = 0; c < 8; c++ )
                row.push( new Cell( r, c, this.getInitialPlayer( r, c ), this.cellIsInitialTarget( r, c ) ) );

            gameBoard.rows.push( row );
        }

        return gameBoard;
    }

}();

export default BoardManager;
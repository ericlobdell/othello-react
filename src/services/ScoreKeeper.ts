import BoardManager from './BoardManager';
import Move from '../models/Move';
import Gameboard from '../models/Gameboard';
import Cell from '../models/Cell';
import Player from '../models/Player';

const ScoreKeeper = new class Scorekeeper {

    getMoveCaptures ( initialRow: number, initialCol: number, player: number, gameBoard: Gameboard ): Cell[] {
        let hits: Cell[] = [];

        for ( let rowIncrement = -1; rowIncrement <= 1; rowIncrement++ )
            for ( let colIncrement = -1; colIncrement <= 1; colIncrement++ )
                if ( rowIncrement === 0 && colIncrement === 0 )
                    continue;
                else
                    // tslint:disable-next-line:max-line-length
                    hits = hits.concat( this.doDirectionalSearch( initialRow, initialCol, rowIncrement, colIncrement, player, gameBoard ) );

        return hits;
    }

    doDirectionalSearch ( row: number, col: number, rowInc: number, colInc: number, player: number, gameBoard: Gameboard ) {
        const cell = BoardManager.tryGetCell( row + rowInc, col + colInc, gameBoard );
        return cell !== null ?
            this.getDirectionalCaptures( cell, rowInc, colInc, player, gameBoard ) : [];
    }

    getDirectionalCaptures ( initialCell: Cell, rowInc: number, colInc: number, player: number, gameBoard: Gameboard ): Cell[] {
        const captures: Cell[] = [];

        const getCapturesRecursive = ( r: number, c: number ): Cell[] => {
            const cell = BoardManager.tryGetCell( r, c, gameBoard );

            if ( cell === null ) // we've walked off the game board
                return [];

            let { isEmptyPosition, isOpponentPosition } = this.evaluateCell( cell, player );

            if ( isEmptyPosition ) {
                return [];
            } else if ( isOpponentPosition ) {
                captures.push( cell );
                return getCapturesRecursive( r + rowInc, c + colInc );
            } else {
                return captures;
            }
        };

        return getCapturesRecursive( initialCell.row, initialCell.col );
    }

    evaluateCell ( cell: Cell, player: number ): CellEvaluationResult {
        return {
            isEmptyPosition: cell.player === 0,
            isOpponentPosition: cell.player !== 0 && cell.player !== player
        };
    }

    recordMove ( row: number, col: number, playerNumber: number, gameBoard: Gameboard, isHighScoring: boolean ): RecordMoveResult {
        const opponentCaptures = this.getMoveCaptures( row, col, playerNumber, gameBoard );
        const currentMove = new Move( row, col, opponentCaptures.length, playerNumber, isHighScoring );

        if ( opponentCaptures.length ) {

            gameBoard.moves.push( currentMove );
            gameBoard.rows[ row ][ col ].player = playerNumber;

            opponentCaptures.forEach( c => {
                c.distance = this.getHitDistance( currentMove, c.col, c.row );
                c.player = playerNumber;
                c.isHit = true;
            } );

        }

        return new RecordMoveResult( opponentCaptures );

    }

    getHitDistance ( move: Move, col: number, row: number ): number {
        const rowDiff = Math.abs( row - move.row );
        const colDiff = Math.abs( col - move.col );

        return rowDiff || colDiff;
    }

    getScoreForPlayer ( playerNumber: number, gameBoard: Gameboard ): number {
        return BoardManager.getFlatGameBoard( gameBoard )
            .filter( c => c.player === playerNumber )
            .length;
    }

    getLeader( player1: Player, player2: Player ): number {

        if ( player1.score > player2.score )
            return 1;

        else if ( player2.score > player1.score )
            return 2;

        else
            return 0;
    }

    resetMoveRatings ( gameBoard: Gameboard ): Gameboard {
        BoardManager.getFlatGameBoard( gameBoard )
            .forEach( cell  => {
                cell.isHighestScoring = false;
                cell.isHit = false;
                cell.distance = 0;
            } );

        return gameBoard;
    }

    // impure
    setPlayerScores ( players: Player[], gameBoard: Gameboard ): void {
        players.forEach( p =>
            p.score = this.getScoreForPlayer( p.number, gameBoard ) );
    }

    getNextMovesForPlayer ( playerNumber: number, gameBoard: Gameboard ): Cell[] {
        const nextMoves: Cell[] = [];
        const opponent = playerNumber === 1 ? 2 : 1;
        let highestPointValue = 0;
        
        BoardManager.resetTargetCells( gameBoard );

        BoardManager.getPlayerCells( opponent, gameBoard )
            .forEach( opponentCell => {

                BoardManager.getOpenAdjacentCells( opponentCell, gameBoard )
                    .forEach( adjacentCell => {

                        const pointsEarned = this.getMoveCaptures( adjacentCell.row, adjacentCell.col, playerNumber, gameBoard ).length;

                        highestPointValue = ( highestPointValue > pointsEarned ) ? highestPointValue : pointsEarned;

                        if ( pointsEarned ) {
                            adjacentCell.isTarget = true;
                            adjacentCell.pointValue = pointsEarned;
                            nextMoves.push( adjacentCell );
                        }

                    } );

            } );

        nextMoves.forEach( (m: Move) => m.isHighestScoring = m.pointValue === highestPointValue );
        return nextMoves;
    }

}();

export default ScoreKeeper;

class RecordMoveResult {

    captures: Cell[];
    wasScoringMove: boolean;

    constructor( captures: Cell[] ) {
        this.captures = captures;
        this.wasScoringMove = captures.length > 0;
    }

}

interface CellEvaluationResult {
    isEmptyPosition: boolean;
    isOpponentPosition: boolean;
}
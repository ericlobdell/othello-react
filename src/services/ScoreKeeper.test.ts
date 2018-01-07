import ScoreKeeper from './ScoreKeeper';
import Cell from '../models/Cell';
import Player from '../models/Player';
import BoardManager from '../services/BoardManager';

const _ = null;

describe( 'ScoreKeeper', () => {
    const _players = [new Player( 1 ), new Player( 2 )];

    describe( 'getScoreForPlayer', () => {
        it( 'should return the number of cells of the game board occupied by the player', () => {
            const gb = {
                moves: [[null]],
                rows: [
                    [{ player: 1 }, { player: 1 }, { player: 0 }],
                    [{ player: 1 }, { player: 1 }, { player: 0 }],
                    [{ player: 1 }, { player: 0 }, { player: 0 }]
                ]
            };

            const sut = ScoreKeeper.getScoreForPlayer( 1, gb );
            expect( sut ).toBe( 5 );
        } );
    } );

    describe( 'doDirectionalSearch', () => {
        it( 'should return an empty array if passed an invalid cell location', () => {
            const sut = ScoreKeeper.doDirectionalSearch( 0, 0, 0, 0, 1, {
                moves: [[null]],
                rows: [
                    [{ row: -1, col: 1 }]
                ]
            } );

            expect( sut ).toEqual( [] );
        } );
    } );

    describe('getHitDistance', () => {
        it('should set the distance from the cell the move originated', () => {
            const move = new Cell( 1, 1, _, _);
            const hitRow = 4;
            const hitCol = 4;
            const d = ScoreKeeper.getHitDistance( move, hitRow, hitCol );

            expect( d ).toBe(3);

            const hitRow2 = 1;
            const hitCol2 = 5;
            const d2 = ScoreKeeper.getHitDistance( move, hitRow2, hitCol2 );

            expect(d2).toBe(4);

            const hitRow3 = 3;
            const hitCol3 = 1;
            const d3 = ScoreKeeper.getHitDistance( move, hitRow3, hitCol3 );

            expect(d3).toBe(2);
        });

    });

    describe( 'getMoveCaptures', () => {
        it( 'should search in all 8 directions for possible points', () => {
            const gb = BoardManager.getInitialGameBoard(_players);

            spyOn( ScoreKeeper, 'doDirectionalSearch' );

            ScoreKeeper.getMoveCaptures( 3, 3, 1, gb );
            const calls = ScoreKeeper.doDirectionalSearch.calls;

            expect( calls.count() ).toBe( 8 );

            // up and left
            expect( calls.argsFor( 0 )[2] ).toBe( -1 );
            expect( calls.argsFor( 0 )[3] ).toBe( -1 );

            // up
            expect( calls.argsFor( 1 )[2] ).toBe( -1 );
            expect( calls.argsFor( 1 )[3] ).toBe( 0 );

            // up and right
            expect( calls.argsFor( 2 )[2] ).toBe( -1 );
            expect( calls.argsFor( 2 )[3] ).toBe( 1 );

            // left
            expect( calls.argsFor( 3 )[2] ).toBe( 0 );
            expect( calls.argsFor( 3 )[3] ).toBe( -1 );

            // right
            expect( calls.argsFor( 4 )[2] ).toBe( 0 );
            expect( calls.argsFor( 4 )[3] ).toBe( 1 );

            // down and left
            expect( calls.argsFor( 5 )[2] ).toBe( 1 );
            expect( calls.argsFor( 5 )[3] ).toBe( -1 );

            // down
            expect( calls.argsFor( 6 )[2] ).toBe( 1 );
            expect( calls.argsFor( 6 )[3] ).toBe( 0 );

            // down and right
            expect( calls.argsFor( 7 )[2] ).toBe( 1 );
            expect( calls.argsFor( 7 )[3] ).toBe( 1 );
        } );

        it( 'should calculate the correct score', () => {
            const gb = BoardManager.getInitialGameBoard(_players);
            const hits = ScoreKeeper.getMoveCaptures( 5, 3, 1, gb );
            expect(hits.length).toBe(1);

        } );

    } );

    describe('getNextMovesForPlayer', () => {
        it('should return an array of cells that the next player can use as a next move', () => {
            const gb = BoardManager.getInitialGameBoard(_players);

            const sut = ScoreKeeper.getNextMovesForPlayer( 1, gb );

            expect( sut.length ).toBe( 4 );
        } );

        it( 'should mark all cells as isTarget', () => {
            const gb = BoardManager.getInitialGameBoard(_players);

            const nextMoves = ScoreKeeper.getNextMovesForPlayer( 1, gb );

            nextMoves.forEach(
                (m: Move) => expect( m.isTarget ).toBe( true ) );
        } );
    } );

    describe( 'getLeader', () => {
        it( 'should return the player number of the player with the higher score', () => {
            const p1 = new Player( 1 );
            const p2 = new Player( 2 );

            p1.score = 10;
            p2.score = 4;

            const sut = ScoreKeeper.getLeader( p1, p2 );
            expect( sut ).toBe( 1 );
        } );

        it( 'should return zero if scores are equal', () => {
            const p1 = new Player( 1 );
            const p2 = new Player( 2 );

            p1.score = 10;
            p2.score = 10;

            const sut = ScoreKeeper.getLeader( p1, p2 );
            expect( sut ).toBe( 0 );
        } );

    } );
} );
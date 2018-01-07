
import BoardManager from './BoardManager';
import Player from '../models/Player';

describe( 'BoardManager', function () {
    const _players = [new Player( 1 ), new Player( 2 )];

    describe( 'getEmptyCells', () => {
        it( 'should return only the cells of the game board that are unoccupied', function () {
            const expected = [{ player: 0 }, { player: 0 }, { player: 0 }, { player: 0 }];
            const gb = {
                rows: [
                    [{ player: 1 }, { player: 1 }, { player: 0 }],
                    [{ player: 1 }, { player: 1 }, { player: 0 }],
                    [{ player: 1 }, { player: 0 }, { player: 0 }]
                ]
            };
            const sut = BoardManager.getEmptyCells( gb );

            expect( sut.length ).toBe( 4 );
            expect( sut ).toEqual( expected );
        });
    });

    describe( 'getInitialGameBoard', () => {
        it( 'should return a gameboard with the initial center squares occupied', () => {
            const gb = BoardManager.getInitialGameBoard( _players );

            expect( gb.rows[3][3].player ).toBe( 1 );
            expect( gb.rows[4][4].player ).toBe( 1 );
            expect( gb.rows[3][4].player ).toBe( 2 );
            expect( gb.rows[4][3].player ).toBe( 2 );
        })
    });

    describe( 'getiInitialPlayer', () => {
        it( 'should return the correct player number for initial positions on gameboard', () => {
            expect( BoardManager.getInitialPlayer( 3, 3 ) ).toBe( 1 );
            expect( BoardManager.getInitialPlayer( 4, 4 ) ).toBe( 1 );
            expect( BoardManager.getInitialPlayer( 3, 4 ) ).toBe( 2 );
            expect( BoardManager.getInitialPlayer( 4, 3 ) ).toBe( 2 );
        })
    });

    describe( 'cellIsTarget', () => {
        it( 'should return true for initial potential moves for player one', () => {
            expect( BoardManager.cellIsInitialTarget( 2, 4 ) ).toBe( true );
            expect( BoardManager.cellIsInitialTarget( 4, 2 ) ).toBe( true );
            expect( BoardManager.cellIsInitialTarget( 3, 5 ) ).toBe( true );
            expect( BoardManager.cellIsInitialTarget( 5, 3 ) ).toBe( true );
        });
    });

    describe( 'resetTargetCells', () => {
        it( 'should set isTarget property of all cells to false', () => {
            const gb = BoardManager.getInitialGameBoard( _players );

            expect( BoardManager.getFlatGameBoard( gb )
                .some( c => c.isTarget ) )
                .toBe( true );

            BoardManager.resetTargetCells( gb );

            expect( BoardManager.getFlatGameBoard( gb )
                .some( c => c.isTarget ) )
                .toBe( false );

        });
    });

    describe( 'getPlayerCells', () => {
        it( 'should return an array of cells belonging to the player', () => {
            const gb = BoardManager.getInitialGameBoard( _players );
            const player2Cells = BoardManager.getPlayerCells( 2, gb );

            expect( player2Cells.length ).toBe( 2 );
            player2Cells.forEach( c => {
                expect( c.player ).toBe( 2 );
            });

        });
    });

    describe( 'getAdjacentCells', () => {
        it( 'should return every cell surrounding the position on the game board', () => {
            const gb = BoardManager.getInitialGameBoard( _players );

            const position1 = gb.rows[4][3];
            const sut1 = BoardManager.getAdjacentCells( position1, gb );

            expect( sut1.length ).toBe( 8 );

            const position2 = gb.rows[0][0];
            const sut2 = BoardManager.getAdjacentCells( position2, gb );

            expect( sut2.length ).toBe( 3 );
        });
    });

    describe( 'getOpenAdjacentCells', () => {
        it( 'should return te cells adjacent to the passed cell on the game board', () => {
            const gb = BoardManager.getInitialGameBoard( _players );

            const position1 = gb.rows[4][3];
            const sut1 = BoardManager.getOpenAdjacentCells( position1, gb );

            expect( sut1.length ).toBe( 5 );

            const position2 = gb.rows[0][0];
            const sut2 = BoardManager.getOpenAdjacentCells( position2, gb );

            expect( sut2.length ).toBe( 3 );

        });
    });
});
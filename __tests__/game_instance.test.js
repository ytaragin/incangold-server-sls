let gm = require('../lib/game_instance');
let Cards = require('../lib/Cards')
const _ = require('lodash');



describe('Manager Setup', () => {
    test('Test Add Player', () => {
        let mgr = new gm.GameInstance();

        mgr.addPlayer('John');
        mgr.addPlayer('Dave');
        mgr.addPlayer('Bill');
        expect(mgr.playerCount()).toBe(3);
    });


    test('Initial Setup', () => {
        let mgr = new gm.GameInstance();

        mgr.addPlayer('John');
        mgr.addPlayer('Dave');
        mgr.addPlayer('Bill');


        let johnState = mgr.getStateForPlayer('John');
        expect(johnState.treasureInTent).toBe(0);
        expect(johnState.pendingTreasure).toBe(0);
        expect(johnState.artifactsRcvd).toBe(0);

    });

});




describe('A Game Flow', () => {


    test('Do First Round', () => {
        let game = new gm.GameInstance();

        let deck = [
            new Cards.TreasureCard({img:"", value:7}),
            new Cards.TreasureCard({img:"", value:9}),
            new Cards.HazardCard({img:"", type:"Spider"}),
            new Cards.TreasureCard({img:"", value:11}),
            new Cards.ArtifactCard({img:""}),
            new Cards.HazardCard({img:"", type:"Fire"}),
            new Cards.HazardCard({img:"", type:"Spider"}),
            new Cards.TreasureCard({img:"", value:5}),
            new Cards.HazardCard({img:"", type:"Fire"})
        ];


        let expectState = {
            gameMove: 0,
            currentRound: 1,
            moveInRound: 0,
            treasureWaiting: 0,
            artifactsWaiting: 0,
            removedCards: [],
            cardsLeftInDeck: 31,
            lastCardPlayed: null,
            endOfRound: false,
            whichHazardsPlayed: {
                Fire: 0,
                Pit: 0,
                Rockfall: 0,
                Snake: 0,
                Spider: 0,
            },
            activePlayers: [
                {name: 'John', pendingTreasure: 0},
                {name: 'Dave', pendingTreasure: 0},
                {name: 'Bill', pendingTreasure: 0},
            ]

        };

        game.addPlayer('John');
        game.addPlayer('Dave');
        game.addPlayer('Bill');

        game.beginRound();
        let state = game.getPublicGameState();
        expect(state).toEqual(expectState);

        let tempDeck =  _.clone(deck);
        game.state.deck = tempDeck;

        expect(game.isReadyForNextMove()).toBeFalsy();


        expectState.cardsLeftInDeck = 9;

        state = game.getPublicGameState();
        expect(state).toEqual(expectState);


        expect(()=> {game.doNextMove()}).toThrow('Not all players have entered their move');
        let curMove = 1;

        game.setMove(curMove, 'John', true);
        game.setMove(curMove, 'Dave', true);
        expect(game.isReadyForNextMove()).toBeFalsy();

        game.setMove(curMove, 'Bill', true);

        expect(game.isReadyForNextMove()).toBeTruthy();


        game.doNextMove();

        expectState.moveInRound = 1;
        expectState.gameMove = curMove;
        expectState.treasureWaiting = 1;
        expectState.cardsLeftInDeck = 8;
        expectState.lastCardPlayed = deck.shift();
        expectState.activePlayers = [
            {name: 'John', pendingTreasure: 2},
            {name: 'Dave', pendingTreasure: 2},
            {name: 'Bill', pendingTreasure: 2},
        ];

        expect(game.getPublicGameState()).toEqual(expectState);

        expect(()=> {game.doNextMove()}).toThrow('Not all players have entered their move');

        curMove += 1;
        game.setMove(curMove, 'John', true);
        game.setMove(curMove, 'Dave', true);
        game.setMove(curMove, 'Bill', true);

        game.doNextMove();

        expectState.moveInRound+=1;
        expectState.gameMove = curMove;
        expectState.cardsLeftInDeck-=1;
        expectState.lastCardPlayed = deck.shift();
        expectState.activePlayers = [
            {name: 'John', pendingTreasure: 5},
            {name: 'Dave', pendingTreasure: 5},
            {name: 'Bill', pendingTreasure: 5},
        ];


        expect(game.getPublicGameState()).toEqual(expectState);

        expect(()=> {game.doNextMove()}).toThrow('Not all players have entered their move');

        curMove += 1;

        expect(()=> {game.setMove(curMove+1, 'John', true)}).toThrow(`${curMove+1} is not the current move`);
        expect(()=> {game.setMove(curMove-1, 'John', true)}).toThrow(`${curMove-1} is not the current move`);


        game.setMove(curMove, 'John', true);
        game.setMove(curMove, 'Dave', true);
        game.setMove(curMove, 'Bill', true);

        game.doNextMove();

        expectState.moveInRound += 1;
        expectState.gameMove = curMove;
        expectState.cardsLeftInDeck -= 1;
        expectState.whichHazardsPlayed.Spider = 1;
        expectState.lastCardPlayed = deck.shift();

        expect(game.getPublicGameState()).toEqual(expectState);

        curMove += 1;

        game.setMove(curMove, 'John', true);
        game.setMove(curMove, 'Dave', true);
        game.setMove(curMove, 'Bill', false);
        game.doNextMove();

        expectState.moveInRound += 1;
        expectState.gameMove = curMove;
        expectState.cardsLeftInDeck -= 1;
        expectState.treasureWaiting = 1;
        expectState.lastCardPlayed = deck.shift();

        expectState.activePlayers = [
            {name: 'John', pendingTreasure: 10},
            {name: 'Dave', pendingTreasure: 10},
        ];


        expect(game.getPublicGameState()).toEqual(expectState);

        let billState = game.getStateForPlayer("Bill")
        expect(billState).toEqual({
            treasureInTent: 6,
            pendingTreasure: 0,
            artifactsRcvd: 0,

        });


        curMove += 1;

        game.setMove(curMove, 'John', true);
        game.setMove(curMove, 'Dave', true);
        game.doNextMove();


        expectState.moveInRound += 1;
        expectState.gameMove = curMove;
        expectState.cardsLeftInDeck -= 1;
        expectState.treasureWaiting = 1;
        expectState.artifactsWaiting = 1;
        expectState.lastCardPlayed = deck.shift();
        expectState.activePlayers = [
            {name: 'John', pendingTreasure: 10},
            {name: 'Dave', pendingTreasure: 10},
        ];
        expectState.removedCards = [{name:"Artifact", img:""}];


        expect(game.getPublicGameState()).toEqual(expectState);


        curMove += 1;

        game.setMove(curMove, 'John', true);
        game.setMove(curMove, 'Dave', true);
        game.doNextMove();

        expectState.moveInRound += 1;
        expectState.gameMove = curMove;
        expectState.cardsLeftInDeck -= 1;
        expectState.whichHazardsPlayed.Fire = 1;
        expectState.lastCardPlayed = deck.shift();

        expect(game.getPublicGameState()).toEqual(expectState);

        curMove += 1;

        game.setMove(curMove, 'John', true);
        game.setMove(curMove, 'Dave', false);
        game.doNextMove();

        expectState.moveInRound += 1;
        expectState.gameMove = curMove;
        expectState.cardsLeftInDeck -= 1;
        expectState.activePlayers = [];
        expectState.artifactsWaiting = 0;
        expectState.treasureWaiting = 0;
        expectState.whichHazardsPlayed.Spider += 1;
        expectState.lastCardPlayed = deck.shift();
        expectState.endOfRound = true;

        expectState.removedCards.push({name:"Hazard: Spider", img:"", type: "Spider"})


        expect(game.getPublicGameState()).toEqual(expectState);

        expect(game.getStateForPlayer("Bill")).toEqual({
            treasureInTent: 6,
            pendingTreasure: 0,
            artifactsRcvd: 0
        })

        expect(game.getStateForPlayer("Dave")).toEqual({
            treasureInTent: 16,
            pendingTreasure: 0,
            artifactsRcvd: 1
        })

        expect(game.getStateForPlayer("John")).toEqual({
            treasureInTent: 0,
            pendingTreasure: 0,
            artifactsRcvd: 0
        })



        let remDeck = expectState.removedCards;
        expectState = {
            currentRound: 2,
            moveInRound: 0,
            gameMove: curMove,
            treasureWaiting: 0,
            artifactsWaiting: 0,
            removedCards: remDeck,
            cardsLeftInDeck: 8,
            lastCardPlayed: null,
            endOfRound: false,
            whichHazardsPlayed: {
                Fire: 0,
                Pit: 0,
                Rockfall: 0,
                Snake: 0,
                Spider: 0,
            },
            activePlayers: [
                {name: 'John', pendingTreasure: 0},
                {name: 'Dave', pendingTreasure: 0},
                {name: 'Bill', pendingTreasure: 0},
            ]

        };

        game.beginRound();
        expect(game.getPublicGameState()).toEqual(expectState);




    });
});


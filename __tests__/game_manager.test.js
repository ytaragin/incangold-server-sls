const GM = require("../lib/game_manager");
const GAME = require("../lib/game_instance");
const AWS = require('aws-sdk')
const DBUtils = require('./DynamoDBUtils');


AWS.config.update({
    region: "us-east-2",
    endpoint: "http://localhost:8000"
});

beforeEach(async () => {
    console.log("Setting Up DB");
    await DBUtils.deleteTable(AWS, DBUtils.gameDeleteParams);
    await DBUtils.createTable(AWS, DBUtils.gameCreateParams);

    //do something
});

test('Get Empty Game List', async () => {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let gameManager = new GM.GameManager({tableName:DBUtils.GAMESTABLENAME, docClient:docClient} );

    let val = await gameManager.getGameListBrief();
    expect(val).toEqual([]);
});


test('Create and Get Game List', async () => {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let gameManager = new GM.GameManager({tableName:DBUtils.GAMESTABLENAME, docClient:docClient} );

    let ids = [];
    ids.push(await gameManager.createGame());
    ids.push( await gameManager.createGame());

    let val = await gameManager.getGameListBrief();

    val = val.sort((a, b) => (a.gameID > b.gameID) ? 1 : -1)
    ids = ids.sort((a, b) => (a.fullID > b.fullID) ? 1 : -1)



    expect(val.length).toEqual(2);
    expect(val[0].gameID).toEqual(ids[0].fullID);
    expect(val[0].gameStatus).toEqual("CREATED");
    expect(val[1].gameID).toEqual(ids[1].fullID);
    expect(val[1].gameStatus).toEqual("CREATED");
});



test('Create Game', async () => {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let gameManager = new GM.GameManager({tableName:DBUtils.GAMESTABLENAME, docClient:docClient} );


   let ids = await gameManager.createGame();
   expect(ids).not.toBe(null);

   let game = await gameManager.getGameInstance(ids.fullID);

   let testGame = new GAME.GameInstance();
   expect(game).toEqual(testGame);



});

test('Update Game', async () => {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let gameManager = new GM.GameManager({tableName:DBUtils.GAMESTABLENAME, docClient:docClient} );


    let ids = await gameManager.createGame();
    expect(ids).not.toBe(null);

    let game = await gameManager.getGameInstance(ids.fullID);

    let testGame = new GAME.GameInstance();
    expect(game).toEqual(testGame);

    testGame.addPlayer("Joe");
    testGame.addPlayer("Bill");
   // testGame.beginRound();

    let succ = await gameManager.saveGameInstance({fullID: ids.fullID,game:testGame,newStatus:"STARTED"});
    expect(succ).toBeTruthy();

    game = await gameManager.getGameInstance(ids.fullID);
    expect(game).toEqual(testGame);





});


test('Unknown Game', async () => {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let gameManager = new GM.GameManager({tableName: DBUtils.GAMESTABLENAME, docClient: docClient});

    let game = await gameManager.getGameInstance("NO_ID");
    expect(game).toBeFalsy();

});

test('Register Player', async () => {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let gameManager = new GM.GameManager({tableName: DBUtils.GAMESTABLENAME, docClient: docClient});


    let ids = await gameManager.createGame();
    expect(ids).not.toBe(null);

    let res = await gameManager.registerPlayerInGame(ids.fullID, "Joe");
    expect(res).toBeTruthy();
    res = await gameManager.registerPlayerInGame(ids.fullID, "Bill");
    expect(res).toBeTruthy();

    let testGame = new GAME.GameInstance();

    testGame.addPlayer("Joe");
    testGame.addPlayer("Bill");
    // testGame.beginRound();



    let game = await gameManager.getGameInstance(ids.fullID);

    expect(game.state.players).toEqual(testGame.state.players);


});
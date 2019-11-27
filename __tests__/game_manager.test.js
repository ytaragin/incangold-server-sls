const GM = require("../lib/game_manager");
const GAME = require("../lib/game_instance");
const AWS = require('aws-sdk')
const DBUtils = require('./DynamoDBUtils');


AWS.config.update({
    region: "us-east-2",
    endpoint: "http://localhost:8000"
});

const TABLENAME = "gamesTable";

const gameCreateParams = {
    TableName : TABLENAME,
    KeySchema: [
        { AttributeName: "gameID", KeyType: "HASH"}  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "gameID", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};

const gameDeleteParams = {
    TableName : TABLENAME
};



beforeEach(async () => {
    console.log("Setting Up DB");
    await DBUtils.deleteTable(AWS, gameDeleteParams);
    await DBUtils.createTable(AWS, gameCreateParams);

    //do something
});

test('Get Empty Game List', async () => {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let gameManager = new GM.GameManager({tableName:TABLENAME, docClient:docClient} );

    let val = await gameManager.getGameListBrief();
    expect(val.Items).toEqual([]);
});


test('Create and Get Game List', async () => {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let gameManager = new GM.GameManager({tableName:TABLENAME, docClient:docClient} );

    let id1 = await gameManager.createGame();
    let id2 = await gameManager.createGame();

    let val = await gameManager.getGameListBrief();
    expect(val.Count).toEqual(2);
    expect(val.Items[0].gameID).toEqual(id2.fullID);
    expect(val.Items[0].gameStatus).toEqual("CREATED");
    expect(val.Items[1].gameID).toEqual(id1.fullID);
    expect(val.Items[1].gameStatus).toEqual("CREATED");
});



test('Create Game', async () => {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let gameManager = new GM.GameManager({tableName:TABLENAME, docClient:docClient} );


   let ids = await gameManager.createGame();
   expect(ids).not.toBe(null);

   let game = await gameManager.getGameInstance(ids.fullID);

   let testGame = new GAME.GameInstance();
   expect(game).toEqual(testGame);



});

test('Update Game', async () => {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let gameManager = new GM.GameManager({tableName:TABLENAME, docClient:docClient} );


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


test('Update Game', async () => {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let gameManager = new GM.GameManager({tableName: TABLENAME, docClient: docClient});

    let game = await gameManager.getGameInstance("NO_ID");
    expect(game).toBeFalsy();

});
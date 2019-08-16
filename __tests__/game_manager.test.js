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
        { AttributeName: "gameID", KeyType: "HASH"},  //Partition key
        { AttributeName: "createTime", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "createTime", AttributeType: "N" },
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



test('Create Game', async () => {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let gameManager = new GM.GameManager({tableName:TABLENAME, docClient:docClient} );


   let ids = await gameManager.createGame();
   expect(ids).not.toBe(null);

   let game = await gameManager.getGameInstance(ids.fullID);

   let testGame = new GAME.GameInstance();
   expect(game).toEqual(testGame);



});

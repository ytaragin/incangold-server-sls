const GM = require("../lib/game_manager");
const MM = require("../lib/moves_manager");
const GAME = require("../lib/game_instance");
const AWS = require('aws-sdk')
const DBUtils = require('./DynamoDBUtils');


AWS.config.update({
    region: "us-east-2",
    endpoint: "http://localhost:8000"
});


beforeEach(async () => {
    console.log("Setting Up DB");
    await DBUtils.deleteTable(AWS, DBUtils.movesDeleteParams);
    await DBUtils.createTable(AWS, DBUtils.movesCreateParams);

    await DBUtils.deleteTable(AWS, DBUtils.gameDeleteParams);
    await DBUtils.createTable(AWS, DBUtils.gameCreateParams);


    //do something
});

test('StoreMoves', async () => {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let gameManager = new GM.GameManager({tableName:DBUtils.GAMESTABLENAME, docClient:docClient} );
    let movesMgr = new MM.MovesManager({tableName:DBUtils.MOVESTABLENAME, docClient:docClient} );


    await gameManager.createGame();




});
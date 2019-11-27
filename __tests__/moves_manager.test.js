const MM = require("../lib/moves_manager");
const AWS = require('aws-sdk');
const DBUtils = require('./DynamoDBUtils');


AWS.config.update({
    region: "us-east-2",
    endpoint: "http://localhost:8000"
});

const TABLENAME = "movesTable";

const movesCreateParams = {
    TableName : TABLENAME,
    KeySchema: [
        { AttributeName: "gameID", KeyType: "HASH"},  //Partition key
        { AttributeName: "turnPerson", KeyType: "RANGE"},  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "gameID", AttributeType: "S" },
        { AttributeName: "turnPerson", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};

const movesDeleteParams = {
    TableName : TABLENAME
};



beforeEach(async () => {
    console.log("Setting Up DB");
    await DBUtils.deleteTable(AWS, movesDeleteParams);
    await DBUtils.createTable(AWS, movesCreateParams);

    //do something
});

test('StoreMoves', async () => {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let movesMgr = new MM.MovesManager({tableName:TABLENAME, docClient:docClient} );

    let gameID = "game123";
    let turnID = 12;

    let moves1 = [
        {
            gameID, turnID, playerID:"John", stayNextMove:true
        },
        {
            gameID, turnID, playerID:"Bill", stayNextMove:false
        },

    ]


    let res = await movesMgr.storeMove(moves1[0]);
    expect(res).toBe(true);

    res = await movesMgr.storeMove(moves1[1]);
    expect(res).toBe(true);

    let gotMoves = await movesMgr.getTurnMoves(gameID, turnID);

    gotMoves = gotMoves.sort((a, b) => (a.playerID > b.playerID) ? 1 : -1)
    moves1 = moves1.sort((a, b) => (a.playerID > b.playerID) ? 1 : -1)

    expect(gotMoves).toEqual(moves1);

   turnID = 13;

    let moves2 = [
        {
            gameID, turnID, playerID:"John", stayNextMove:true
        }

    ];

    res = await movesMgr.storeMove(moves2[0]);
    expect(res).toBe(true);

    gotMoves = await movesMgr.getTurnMoves(gameID, turnID-1);

    gotMoves = gotMoves.sort((a, b) => (a.playerID > b.playerID) ? 1 : -1)
    moves1 = moves1.sort((a, b) => (a.playerID > b.playerID) ? 1 : -1)

    expect(gotMoves).toEqual(moves1);


    let gotMoves2 = await movesMgr.getTurnMoves(gameID, turnID);

    gotMoves2 = gotMoves2.sort((a, b) => (a.playerID > b.playerID) ? 1 : -1)
    moves2 = moves2.sort((a, b) => (a.playerID > b.playerID) ? 1 : -1)

    expect(gotMoves2).toEqual(moves2);


});

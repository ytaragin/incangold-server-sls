const AWS = require('aws-sdk')
const DBUtils = require('./DynamoDBUtils');


AWS.config.update({
    region: "us-east-2",
    endpoint: "http://localhost:8000"
});


const ConnMgr = require('../lib/connection_manager');

let connCreateParams = {
    TableName : "connTable",
    KeySchema: [
        { AttributeName: "connID", KeyType: "HASH"} , //Partition key
        { AttributeName: "gameID", KeyType: "RANGE"}  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "connID", AttributeType: "S" },
        { AttributeName: "gameID", AttributeType: "S" }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: "gameIDIndex",
            KeySchema: [
                {
                    AttributeName: "gameID",
                    KeyType: "HASH"
                }
            ],
            Projection: {
                "ProjectionType": "ALL"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }

};

let connDeleteParams = {
    TableName : "connTable"
};



beforeEach(async () => {
 console.log("Setting Up DB");
 await DBUtils.deleteTable(AWS, connDeleteParams);
 await DBUtils.createTable(AWS, connCreateParams);

    //do something
});


test('Create Conn', async () => {




    AWS.config.update({
        region: "us-east-2",
        endpoint: "http://localhost:8000"
    });
    let cm;
    let docClient = new AWS.DynamoDB.DocumentClient();
    let apiGW = null;

    expect(() => {
        cm = new ConnMgr.ConnectionManager({tableName : "connTable", docClient, apiGW });
//        console.log(cm);
    }).not.toThrow();


    await cm.addConnection("dd44", "157", "Eric");
    await cm.addConnection("aa11", "156", "John");
    await cm.addConnection("bb22", "156", "Bill");
    await cm.addConnection("cc33", "156", "Dave");


    let conns = await cm.getConnsForGame("156");
    console.log(conns);
    expect(conns.length).toBe(3);


});
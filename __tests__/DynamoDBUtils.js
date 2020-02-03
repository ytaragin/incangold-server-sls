
const GAMESTABLENAME = "gamesTable";
const MOVESTABLENAME = "movesTable";

const gameCreateParams = {
    TableName : GAMESTABLENAME,
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
    TableName : GAMESTABLENAME
};



const movesCreateParams = {
    TableName : MOVESTABLENAME,
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
    TableName : MOVESTABLENAME
};

async function createTable(myAWS, params) {

    var dynamodb = new myAWS.DynamoDB();

    try {
        let ret = await dynamodb.createTable(params).promise();
        console.log("Table Created");
        console.log(ret);

    } catch (err) {
        console.error("Unable to create table. Error: ");
        console.error(err);
    }

}

async function deleteTable(myAWS, params) {
    var dynamodb = new myAWS.DynamoDB();

    try {
        let ret = await dynamodb.deleteTable(params).promise();
        console.log("Table Deleted");
        console.log(ret);

    } catch (err) {
        console.error("Unable to delete table. Error: ");
        console.error(err);
    }


}

module.exports ={
    deleteTable,
    createTable,
    MOVESTABLENAME,
    GAMESTABLENAME,
    gameCreateParams,
    gameDeleteParams,
    movesCreateParams,
    movesDeleteParams
};


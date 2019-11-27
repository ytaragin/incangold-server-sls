const AWS = require('aws-sdk');
const GM = require("../lib/game_manager");

//const DDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});
//const DDBDOC = new AWS.DynamoDB.DocumentClient();
AWS.config.update({ region: process.env.AWS_REGION });



//const GM = new GameList(process.env.GAMES_TABLE);
const GL = new GM.GameManager({tableName:process.env.GAMES_TABLE, docClient:new AWS.DynamoDB.DocumentClient()})



function gameRecToDDB(rec) {

    let dbRec = {
        TableName: process.env.GAMES_TABLE,
        Item: {
            "gameName": {
                S: rec.name
            },
            "createTime": {
                N: (Math.floor(Date.now() / 1000)).toString()
            },
            "numPlayers": {
                N: rec.numPlayers.toString()
            }
        }
    }

    return dbRec;
}


exports.get = async (event, context) => {

    let retValue;

    try {
        let data = await GL.getGameListBrief();
        retValue = {
            statusCode: 200,
            body: data
        };
    } catch (error) {
        console.log(error);

        retValue = {
            statusCode: 400,
            body: error
        }

    }

    return retValue;

};





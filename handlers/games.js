const AWS = require('aws-sdk');
//const DDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});
//const DDBDOC = new AWS.DynamoDB.DocumentClient();



const GL = new GameList(process.env.GAMES_TABLE);



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

exports.post = async (event, context) =>{

    console.log("Post Called");
    if (!event.body) {
        return {
            statusCode: 400,
            error: `No Data`
        };
    }

    console.log(`Post Body ${event.body}`);

    let body = JSON.parse(event.body);
    if (!body.name || body.name == "") {
        return {
            statusCode: 400,
            error: `No Data`
        };
    }

    console.log(`Parsed: ${body}`);


    let retValue = await GL.createGame(body);

    console.log(`Will return ${retValue}`);
    return retValue;
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


exports.delete = async (event, context) => {
    return  {
        statusCode: 200,
        body: "Get A Bunch of Games"
    }
};

exports.GameList = GameList;

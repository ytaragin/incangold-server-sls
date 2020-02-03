const AWS = require('aws-sdk');
const GM = require("../lib/game_manager");

//const DDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});
//const DDBDOC = new AWS.DynamoDB.DocumentClient();
AWS.config.update({ region: process.env.AWS_REGION });



//const GM = new GameList(process.env.GAMES_TABLE);
//const GL = new GM.GameManager({tableName:process.env.GAMES_TABLE, docClient:new AWS.DynamoDB.DocumentClient()})

exports.post = async (event, context) =>{

    const GL = new GM.GameManager({tableName:process.env.GAMES_TABLE, docClient:new AWS.DynamoDB.DocumentClient()});

    /*    console.log("Post Called");
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

    */
    console.log(`Will create a game now`);

    let retValue = await GL.createGame();

    console.log(`Will return `);
    console.log(retValue);
    return  {
        statusCode: 200,
        body: JSON.stringify(retValue)
    };
}


exports.get = async (event, context) => {
    let id = event.pathParameters.id
    console.log(`Game Details Request For: ${id}`);

    const GL = new GM.GameManager({tableName:process.env.GAMES_TABLE, docClient:new AWS.DynamoDB.DocumentClient()})


    let details = await GL.getGameInstance(id);
    console.log("Details");
    console.log(details);
    if (details == null) {
        return {
            statusCode: 404,
            body: `Unknown Game: ${id}`
        };
    }
    else {

        return {
            statusCode: 200,
            body: JSON.stringify(details)
        };
    }

}

exports.delete = async (event, context) => {
    return  {
        statusCode: 200,
        body: "Delete A Games"
    }
};


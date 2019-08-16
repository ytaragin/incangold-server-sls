const GAMEINST = require("./game_instance");



class GameManager {

    constructor({tableName, docClient}) {
        console.log("GameManager created");
        this.table = tableName;
        this.docClient = docClient;

        console.log("GameManager Initialized")

    }

    async createGame(cfg) {

        let game = new GAMEINST.GameInstance(cfg);
        let ids = this.genIDs();

        const currTime = this.getCurrTime();

        let params = {
            TableName : this.table,
            Item: {
                gameID: ids.fullID,
                shortID: ids.shortID,
                gameState: game.state,
                gameConfig: game.config,
                gameStatus: "CREATED",
                createTime: currTime,
                statusTime: currTime
            }
        };

        try {
            console.log("About to call put")
            const data = await this.docClient.put(params).promise();
            console.log(`Rcvd: ${data}`);

        } catch (error) {
            console.log(`Error: ${error}`)
            ids = null;
        }

        return ids;
    }


    async getGameListBrief(){
        let params = {
            TableName: this.table,
            ProjectionExpression: 'gameName, createTime',
            KeyConditionExpression: 'gameName NE :ckey ',
            ExpressionAttributeValues: {
                ':ckey': null

            }
        };

        try {
            let data = await this.docClient.query(params).promise();
            console.log(data);
            return data;
        }  catch (error) {
            console.log(error);
            return error;
        }

    }


    async getGameInstance(gameID){
        let params = {
            TableName: this.table,
            ProjectionExpression: 'statusTime, gameStatus, gameConfig, gameState',
            KeyConditionExpression: 'gameID = :ckey ',
            ExpressionAttributeValues: {
                ':ckey': gameID

            }
        };

        try {
            let data = await this.docClient.query(params).promise();
            console.log(data);
            let game = new GAMEINST.GameInstance(data.gameConfig, data.gameState);
            return game;
        }  catch (error) {
            console.log(error);
            return null;
        }
    }

    saveGameInstance(game) {

    }

    genIDs() {
        let shortID = Math.floor(Math.random() * 899999 + 100000);
        let fullID = ""+Math.floor(Math.random() * 899999 + 100000);

        //todo verify ID uniqueness
        return {shortID, fullID};
    }

    getCurrTime() {
        return Math.floor(Date.now() / 1000);
    }

}

module.exports = {
    GameManager
}
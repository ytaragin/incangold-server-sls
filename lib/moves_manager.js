class MovesManager {

    constructor ({ tableName, docClient }) {
        console.log("MovesManager created");
        this.table = tableName;
        this.docClient = docClient;

        console.log("MovesManager Initialized")

    }

}

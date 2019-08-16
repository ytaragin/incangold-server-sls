


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
    createTable
};


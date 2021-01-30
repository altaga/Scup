module.exports = async function (context, req) {
    const CosmosClient = require('@azure/cosmos').CosmosClient
    const config = require('./config')
    const endpoint = config.endpoint
    const key = config.key
    const databaseId = config.database.id
    const containerId = config.container.id
    const client = new CosmosClient({ endpoint, key })

    const name = (req.query.name || (req.body && req.body.name));
    const oper = (req.query.oper || (req.body && req.body.oper));

    if(oper === "write"){
        const temp = name.replace('"', '').replace('"', '').replace('\\', '').replace('\\', '').split(",")
        const newItem = {
            id: temp[0],
            date: Date.now(),
            bpm: temp[1],
            so2: temp[2],
            temp: temp[3]
        };
    
        async function createFamilyItem(itemBody) {
            const { item } = await client
                .database(databaseId)
                .container(containerId)
                .items.create(itemBody)
                return({
                    status: 200, /* Defaults to 200 */
                    body: oper
                })
        }
    
        context.res = await createFamilyItem(newItem)
        
    }
    else if(oper === "read"){
        let resultString=""
        async function queryContainer() {
            console.log(`Querying container:\n${config.container.id}`)
            const temp = name.replace('"', '').replace('"', '').replace('\\', '').replace('\\', '').split(",")
          
            // query to return all children in a family
            // Including the partition key value of lastName in the WHERE filter results in a more efficient query
            const querySpec = {
                query: 'SELECT * FROM c WHERE c.id = "'+ temp[0] + '"'                
              };
          
            const { resources: results } = await client
              .database(databaseId)
              .container(containerId)
              .items.query(querySpec)
              .fetchAll()
              
            for (var queryResult of results) {
              resultString += JSON.stringify(queryResult)+";"
            }

            return({
                status: 200, /* Defaults to 200 */
                body: resultString
            })

          }
          context.res = await queryContainer()
    }
    else{
        context.res = {
            status: 500,
            body: oper+" error."
        };
    }
    
}
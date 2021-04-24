const {MongoClient} = require('mongodb')
const MONGO_URI = process.env.MONGO_URI
const MONGO_NAME = process.env.MONGO_NAME

let cashedDB

module.exports = async function(transaction = false) {
  if(transaction) {
    const client = await MongoClient.connect(MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true})
    return client.startSession()
  }

  if(!cashedDB) {
    const client = await MongoClient.connect(MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true})
    cashedDB = client.db(MONGO_NAME)
  }
  return cashedDB
}

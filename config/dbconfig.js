const MongoClient = require('mongodb').MongoClient;
const PropertiesReader = require('properties-reader');

var prop = PropertiesReader('./resource.properties');
var dbname = prop.get('db.name');
var dburl = prop.get('db.url');
var dbConnection;
exports.initialize = ()=>{
    return new Promise((resolve, reject)=>{
      const client = new MongoClient(dburl, { useNewUrlParser: true, useUnifiedTopology: true });
      client.connect(err => {
        if(err){
          console.log("DB Connnection failed!")
          throw err;
        }
        console.log("DB Connection is success.");
        dbConnection = client.db(dbname);
      });
    });
}
exports.getCollection = (collName, cb)=>{
  try{
    return cb(null, dbConnection.collection(collName));
  }catch(err){
      return cb(err);
  };
}

const dbResource = require('../config/dbconfig.js');
const TABLE_ACCOUNT = "ACCOUNT_DETAILS";
const TABLE_TRANSFER_ACTIVITY = "TRANSFER_ACTIVITY";
/**
 * Method to get account details.
 * @param {*} accountNo 
 * @param {*} cb 
 */
exports.getAccountDetails = (accountNo, cb) => {
  console.log("Getting information of account: "+accountNo);
    var queryParam = {'AccountNo': accountNo};
    dbResource.getCollection(TABLE_ACCOUNT, (err, collection)=>{
      if(err){
        return cb(err);
      }
      collection.findOne(queryParam, (err, result)=>{
          if(err){
            return cb(err);
          } else if(!result){
            return cb(new Error("Unable to get account: "+accountNo))
          }             
          return cb(null, result);
        });
    });
}
/**
 * Method to get All accounts of User.
 * @param {*} userId 
 * @param {*} cb 
 */
exports.getUserAccounts = (userId, cb) => {
    var queryParam = {'UserId': userId};
    dbResource.getCollection(TABLE_ACCOUNT, (err, collection)=>{
        collection.find(queryParam).toArray((err, result)=>{
           if(err){
             let error = new Error("Unable to get account of user: "+userId);
             return cb(error);
           }
          return cb(null, result);
         });
      });
}
/**
 * Method to update the Account Balance
 * @param {*} accountDetails 
 * @param {*} cb 
 */
exports.updateAccountBalance = (accountDetails, cb)=>{
  const getQuery = {'AccountNo': accountDetails.AccountNo};
  const setQuery = { $set: { 'Amount': accountDetails.Amount} };
  dbResource.getCollection(TABLE_ACCOUNT, (err, collection)=>{
    if(err){
      return cb(err);
    }
    collection.updateOne(getQuery, setQuery, (err, result)=>{
      return cb(err, result);
    });
  });
}
/**
 * Method to insert the transaction activities.
 * @param {*} fromAccountNo 
 * @param {*} toAccountNo 
 * @param {*} amount 
 * @param {*} datetime 
 * @param {*} cb 
 */
exports.insertTransactoinAactivity = (fromAccountNo, toAccountNo, amount, datetime, cb)=>{
  var insetQuery = {'FromAccountNo': fromAccountNo, 'ToAccountNo': toAccountNo, 'Amount': amount, 'CreatedDatetime': datetime};
  dbResource.getCollection(TABLE_TRANSFER_ACTIVITY, (err, collection)=>{
    collection.insertOne(insetQuery, (err, result)=>{
      return cb(err, result);
    })
  })
}
const tranDao = require('./BasicTransactionDao.js');
const async = require('async');

exports.getAccountDetails = (accountNo, cb) =>{
    tranDao.getAccountDetails(accountNo, (err, accountDetails)=>{
        return cb(err, accountDetails);
    });
}

exports.trasnferAmt = (fromAccount, toAccount, amount, cb)=>{
    console.log("Transfring Amount from Account No: "+fromAccount.AccountNo+" to Account No: "+toAccount.AccountNo);
    amount = parseInt(amount);
    fromAccount.Amount = parseInt(fromAccount.Amount) - amount;
    tranDao.updateAccountBalance(fromAccount, (err, result)=>{
        if(err){
            return cb(err);
        }
        toAccount.Amount = parseInt(toAccount.Amount) + amount; 
        tranDao.updateAccountBalance(toAccount, (err, result)=>{
            if(err){
                //rollback transaction
                fromAccount.Amount += amount;
                tranDao.updateAccountBalance(fromAccount, (err, result)=>{
                    if(err){
                        return cb(new Error('Error in Rollback! Please take action immediately.'))
                    }
                });
                return cb(err);
            }
            tranDao.insertTransactoinAactivity(fromAccount.AccountNo, toAccount.AccountNo, amount, new Date(), (err, result)=>{
                if(err){
                    //rollback transaction
                    fromAccount.Amount += amount;
                    toAccount.Amount -= amount; 
                    tranDao.updateAccountBalance(fromAccount, (err, result)=>{
                        if(err){
                            return cb(new Error('Error in Rollback! Please take action immediately.'))
                        }
                    });
                    tranDao.updateAccountBalance(toAccount, (err, result)=>{
                        if(err){
                            return cb(new Error('Error in Rollback! Please take action immediately.'))
                        }
                    });
                    return cb(err);
                }
                return cb(null, result);
            });
        });
    });
}

exports.getUserAccountsBalance = (userId, cb)=>{
    console.log("Getting accounts of userId: "+userId);
    tranDao.getUserAccounts(userId, (err, accounts)=>{console.log("Accounts: "+JSON.stringify(accounts));
        if(err){
            return cb(err);
        }
        return cb(null, accounts.reduce(totlaBalance, 0));
    });
}

function totlaBalance(total, account){
    return total + parseInt(account.Amount);
}
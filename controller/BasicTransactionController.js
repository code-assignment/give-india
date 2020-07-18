const tranService = require('../service/BasicTransactionService.js');
const async = require('async');

exports.transfer = (req, res) =>{
    const fromAccountNo = req.body.fromAccountId;
    const toAccountNo = req.body.toAccountId;
    const amount = parseInt(req.body.amount);
    console.log("fromAccountNo: "+fromAccountNo+", toAccountNo: "+toAccountNo+", amount: "+amount);
        new Promise((resolve, reject)=>{
            initializeDetails(fromAccountNo, toAccountNo, (err, resp)=>{
                if(err){
                    reject(err);
                }
                resolve(resp);
            });
        }).then(resp=>{
            console.log("Resp:  "+JSON.stringify(resp));
            if(amount<1){
                throw new Error("Amount can't be 0 or negative(-ve)");
            }
            validateTransfer(resp.fromAccountDetails, resp.toAccountDetails, amount, (err, isValid)=>{
                if(err){
                    throw err;
                }
                if(isValid){
                    tranService.trasnferAmt(resp.fromAccountDetails, resp.toAccountDetails, amount, (err, result)=>{
                        if(err){
                            throw err;
                        }
                        console.log('Transaction Success.');
                        generateResponse(resp.fromAccountDetails.AccountNo, resp.toAccountDetails.UserId, 
                                                            result.ops[0].CreatedDatetime, (err, result)=>{
                            if(err){
                                throw err;
                            }
                            res.status(200);
                            res.send(result);
                        });
                    });
                }
            });
        }).catch(err=>{
            res.status(404);
            let error = new ErrorResp(404, err.message)
            res.send(error)
        });
}

function generateResponse(fromAccountNo, toAccountUserId, dateTime, next){
    let resp = {};
    const tasks = [
        (cb)=>{
            tranService.getAccountDetails(fromAccountNo, (err, accountDetails)=>{
                resp.newSrcBalance = accountDetails.Amount;
               return cb(err, resp);
            });
        },
        (cb)=>{
            tranService.getUserAccountsBalance(toAccountUserId, (err, totalDestBalance)=>{
                resp.totalDestBalance = totalDestBalance;
                return cb(err, resp);
            });
        }
    ];
    async.parallel(tasks, (err, results) => {console.log("Results: "+JSON.stringify(results));
        let successResp = new SuccessResp(resp.newSrcBalance, resp.totalDestBalance, dateTime);
        return next(err, successResp);
    });
}

function initializeDetails(fromAccountNo, toAccountNo, next){
    let resp = {};
    const tasks = [
        (cb)=>{
            tranService.getAccountDetails(fromAccountNo, (err, accountDetails)=>{
                if(err){
                    return cb(err);
                }
                resp.fromAccountDetails = accountDetails; 
                //console.log("from:  "+JSON.stringify(resp.fromAccountDetails));
                return cb(null, resp);
            });
        },
        (cb)=>{
            tranService.getAccountDetails(toAccountNo, (err, accountDetails)=>{
                if(err){
                    return cb(err);
                }
                resp.toAccountDetails = accountDetails;
                //console.log("To:  "+JSON.stringify(resp.toAccountDetails));
                return cb(null, resp);
            }); 
        }
    ];
    async.parallel(tasks, (err, results) => {
        //console.log("Result:  "+JSON.stringify(resp));
        return next(err, resp);
    });
}

function validateTransfer(fromAccountDetails, toAccountDetails, amount, cb){
    console.log("Validating trasnfer.");
    if(fromAccountDetails.UserId == toAccountDetails.UserId){
        return cb(new Error('Transfer between same user account is not allowed.')); 
    } else if(fromAccountDetails.Amount < amount){
        return cb(new Error("Insufficent balance."));
    } else if((toAccountDetails.AccountType).trim() == '3' && ((parseInt(toAccountDetails.Amount)+amount)>5000000)){
        return cb(new Error("Basic Savings type account Can't have more than RS. 50,000.00 "));
    }else{
        return cb(null, true);
    }
}


class SuccessResp{
    constructor(newSrcBalance, totalDestBalance, transferedAt){
        this.newSrcBalance = newSrcBalance;
        this.totalDestBalance = totalDestBalance;
        this.transferedAt = transferedAt;
    }
}
class ErrorResp{
    constructor(errorCode, errorMessage){
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }
}
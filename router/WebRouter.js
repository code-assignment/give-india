const express = require('express'),
    router = new express.Router(),
    transactionController = require('../controller/BasicTransactionController.js');
    
    router.route('/transfer').post(transactionController.transfer);
    
    module.exports = router;

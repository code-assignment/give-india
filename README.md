# give-india
A REST Api for transaction service on below conditions.

Account types are ‘Savings’, ‘Current’ and ‘BasicSavings’. A single user can have multiple such accounts. The following rules apply:
* Transfer between accounts belonging to the same user is not allowed.
* The balance in ‘BasicSavings’ account type should never exceed Rs. 50,000
* Source account should have the required amount for the transaction to succeed

The API spec follows: (All amounts in the API are in paisa)

Input (JSON)
* fromAccountId
* toAccountId
* amount

Output (JSON)
success case:
* newSrcBalance: The balance in source account after transfer
* totalDestBalance: The total balance in all accounts of destination user combined
* transferedAt: timestamp

failure case:
* errorCode
* errorMessage

# Steps to run
Prerequisite: NodeJs must be installed in your Operating system.

Step-1: Download the source code.

Step-2: Open Command Propmt and navigate to the root directory.

    cd C:\Users\Admin\repo\code-assignment\give-india

Step-3: Start the application by command "node index.js". Below result suffice the success running of server and DB connection.

    Starting application.
    Web server listning on :3000
    DB Connection is success.

Step-4: Start testing the Api enpoints: http://localhost:3000/transfer, with below parameters.

  Method = POST

  Headers: 

    Content-Type = application/json

  Body: select "raw" type data 
  
    {
	    "fromAccountId": "369852",
	    "toAccountId": "369741",
	    "amount": "500000"
    }

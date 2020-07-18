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

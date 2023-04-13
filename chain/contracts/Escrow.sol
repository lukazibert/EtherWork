pragma solidity ^0.8.17;

contract Escrow {
    // The address of the arbitrator
    address public arbitrator;
    // The state of the escrow
    // 0 - Inactive
    // 1 - Active
    // 2 - Released
    // 3 - Dispute
    uint public state;
    // Mapping to store the details of each transaction
    mapping(uint => Transaction) public transactions;

    uint public transactionCount = 0;

    // Struct to store the details of each transaction
    struct Transaction {
        // The address of the buyer
        address payable buyer;
        // The address of the seller
        address payable seller;
        // The amount of ETH in the escrow
        uint amount;
        // The state of the transaction
        // 0 - Inactive
        // 1 - Active
        // 2 - Released
        // 3 - Dispute
        uint state;
    }

    // Events for logging
    event LogFundsDeposited(uint indexed _id, address indexed _from, uint _value);
    event LogFundsReleased(uint indexed _id, address indexed _to, uint _value);
    event LogDisputeRaised(uint indexed _id, address indexed _by, string _reason);
    event LogDisputeResolved(uint indexed _id, bool _release);

    // Constructor function
    constructor(address _arbitrator) payable {
        arbitrator = _arbitrator;
        state = 1;
    }

    function getBalance() public view returns(uint){
    return address(this).balance;
}

    // Function to create a new transaction
    function createTransaction(address payable _buyer, address payable _seller, uint _amount) public {
        require(state == 1, "Escrow is not active");
        // Create a new transaction and store its ID in a local variable
        uint id = transactionCount++;
        transactions[id] = Transaction(_buyer, _seller, _amount, 1);
    }

    // Function to deposit funds into a transaction
    function deposit(uint _id) public payable {
        require(state == 1, "Escrow is not active");
        // Retrieve the transaction from the mapping
        Transaction storage transaction = transactions[_id];
        require(transaction.state == 1, "Transaction is not active");
        // if (msg.value != transaction.amount) {
        //     revert("Incorrect amount deposited");
        // }
        require(msg.value == transaction.amount, "Incorrect amount deposited");
        // Update the state of the transaction to "active"
        transaction.state = 1;
        emit LogFundsDeposited(_id, msg.sender, msg.value);
    }

    // Function for the seller to request the release of funds
    function release(uint _id) public {
        require(state == 1, "Escrow is not active");
        // Retrieve the transaction from the mapping
        Transaction storage transaction = transactions[_id];
        require(transaction.state == 1, "Transaction is not active");
        require(msg.sender == transaction.seller, "Seller can only request release");
        transaction.state = 2;
        transaction.seller.transfer(transaction.amount);
        emit LogFundsReleased(_id, transaction.seller, transaction.amount);
    }

    // Function for the buyer to request the resolution of a dispute
    function raiseDispute(uint _id, string memory _reason) public {
        require(state == 1, "Escrow is not active");
        // Retrieve the transaction from the mapping
        Transaction storage transaction = transactions[_id];
        require(transaction.state == 1, "Transaction is not active");
        require(msg.sender == transaction.buyer, "Buyer can only raise a dispute");
        transaction.state = 3;
        emit LogDisputeRaised(_id, transaction.buyer, _reason);
    }

    // Function for the arbitrator to resolve a dispute
    function resolveDispute(uint _id, bool _release) public {
        require(state == 1, "Escrow is not active");
        // Retrieve the transaction from the mapping
        Transaction storage transaction = transactions[_id];
        require(transaction.state == 3, "No dispute to resolve");
        require(msg.sender == arbitrator, "Only arbitrator can resolve disputes");
        transaction.state = 2;
        if (_release) {
            transaction.seller.transfer(transaction.amount);
            emit LogDisputeResolved(_id, true);
        } else {
            transaction.buyer.transfer(transaction.amount);
            emit LogDisputeResolved(_id, false);
        }
    }
}


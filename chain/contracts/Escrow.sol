pragma solidity ^0.8.6;

contract Escrow {
    // The address of the arbitrator
    address private arbitrator;
    // The state of the escrow
    // 0 - Inactive
    // 1 - Active
    // 2 - Payed
    // 3 - Release
    // 4 - Refund
    uint private state = 0;
    // The amount of ETH in the escrow
    uint private amount;
    // The address of the client
    address payable private client;
    // The address of the freelancer
    address payable private freelancer;

    // Events for logging
    event LogFundsDeposited(address indexed _from, uint _value);

    modifier isPayed() {
        require(state == 2, "Escrow is not payed for");
        _;
    }

    // Constructor function
    constructor(
        address payable _client,
        address payable _freelancer,
        uint _amount
    ) payable {
        require(
            _amount == msg.value,
            "The amount deposited must be equal to the escrow amount"
        );
        arbitrator = msg.sender;
        state = 2;
        amount = _amount;
        client = _client;
        freelancer = _freelancer;
    }

    // Function to release funds to the freelancer
    function releaseFunds() public isPayed {
        // require(state == 2, "The client has not deposited funds");
        // require(freelancer == _freelancer, "Only the freelancer can release funds");
        state = 3;
        freelancer.transfer(address(this).balance);

        // destroy();
    }

    // Function to raise a dispute
    function refundFunds() public isPayed {
        // require(state == 2, "Escrow is not payed for");
        state = 4;
        client.transfer(amount);
        freelancer.transfer(amount);

        // destroy();
    }

    // Function to send report to the arbitrator
    function sendReport() public view returns (uint) {
        return state;
    }

    // Function to destroy the contract
    function destroy() public {
        require(
            msg.sender == arbitrator,
            "Only the arbitrator can destroy the contract"
        );
        selfdestruct(payable(arbitrator));
    }
}

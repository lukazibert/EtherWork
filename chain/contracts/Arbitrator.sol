pragma solidity ^0.8.6;

import "./Escrow.sol";

contract Arbitrator {
    // TODO: change to private after testing
    // mapping(uint => Escrow) private escrowContracts;
    mapping(uint => Escrow) public escrowContracts;
    uint public escrowContractCount = 0;

    address public arbitrator;

    modifier arbitratorOnly() {
        require(
            msg.sender == arbitrator,
            "Only the arbitrator can call this function"
        );
        _;
    }

    struct JobContract {
        address freelancer;
        address client;
        uint amount;
        // bool clientPaid;
        // bool freelancerPaid;
    }

    // TDOD: change to private after testing
    // mapping(uint => JobContract) private jobContracts;
    mapping(uint => JobContract) public jobContracts;
    uint public jobContractCount = 0;

    constructor() payable {
        arbitrator = msg.sender;
    }

    //Getters
    function getArbitratorAddress() public view returns (address) {
        return arbitrator;
    }

    function getJobCount() public view returns (uint) {
        return jobContractCount;
    }

    function getArbitratorBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getEscrowContractState(uint jobId) public view returns (uint) {
        return escrowContracts[jobId].sendReport();
    }

    function getClientAddress(uint jobId) public view returns (address) {
        return jobContracts[jobId].client;
    }

    function getFreelancerAddress(uint jobId) public view returns (address) {
        return jobContracts[jobId].freelancer;
    }


    // Create job contract
    function createJobContract(uint _jobId, uint _amount) public payable {
        require(
            msg.value == _amount,
            "The amount deposited must be equal to the job amount"
        );
        jobContracts[_jobId] = JobContract(address(0), msg.sender, _amount);
        jobContractCount++;
    }

    // Freelancer accepts job contract request
    function acceptJobContract(uint _jobId) public payable {
        require(
            msg.value == jobContracts[_jobId].amount,
            "The amount deposited must be equal to the escrow amount"
        );
        require(
            jobContracts[_jobId].client != address(0),
            "Clients already made a request for the job"
        );

        jobContracts[_jobId].freelancer = msg.sender;

        createEscrow(
            payable(jobContracts[_jobId].client),
            payable(jobContracts[_jobId].freelancer),
            jobContracts[_jobId].amount * 2,
            _jobId
        );
        escrowContractCount++;
    }

    function rejectJobContract(uint _jobId) public {
        require(jobContracts[_jobId].client != address(0), "Client does exist");
        // Refund the client becouse the freelancer rejected the job
        // payable(jobContracts[_jobId].client).transfer(
        //     jobContracts[_jobId].amount
        // );

        bool success = payable(jobContracts[_jobId].client).send(
            jobContracts[_jobId].amount
        );
        require(success, "Transfer failed.");

        // Delete the job contract
        delete jobContracts[_jobId];
        jobContractCount--;
    }

    // Create a new escrow contract
    function createEscrow(
        address payable _client,
        address payable _freelancer,
        uint _amount,
        uint _jobId
    ) private {
        //  TODO: check if this require statment is neccessary
        // require(
        //     jobContracts[_jobId].freelancerPaid == true &&
        //         jobContracts[_jobId].clientPaid == true,
        //     "Client or freelancer has not paid"
        // );

        // Create a new escrow contract and store its ID in a local variable
        escrowContracts[_jobId] = new Escrow{
            value: jobContracts[_jobId].amount * 2
        }(_client, _freelancer, _amount);
    }

    //return report/status of the escrow contract
    function getEscrowStatus(
        uint _jobId
    ) public view arbitratorOnly returns (uint) {
        return escrowContracts[_jobId].sendReport();
    }

    //TODO: resolve dispute
    // function resolveDispute(uint _jobId) public arbitratorOnly {
    //     // escrowContracts[_jobId].releaseFunds();
    // }

    //releas escrow contract
    function releaseEscrow(uint _jobId) public arbitratorOnly {
        escrowContracts[_jobId].releaseFunds();
    }

    //refund escrow contract
    function refundEscrow(uint _jobId) public arbitratorOnly {
        escrowContracts[_jobId].refundFunds();
    }
}

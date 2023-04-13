pragma solidity ^0.8.17;

import "./Escrow.sol";

contract Arbitrator {
    Escrow[] public escrowContracts;

    function createEscrow() public payable {
        Escrow escrow = new Escrow(msg.sender);
        escrowContracts.push(escrow);
    }

    function getDataOfEscrow(uint _id) public view returns (address, uint) {
        return (escrowContracts[_id].arbitrator(), escrowContracts[_id].getBalance());
    }



    
}
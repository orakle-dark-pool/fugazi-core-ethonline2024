// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./FugaziStorageLayout.sol";

/// This contract contains the logic for querying the relevant data
/// such as user balances, pool info, etc.
contract FugaziViewerFacet is FugaziStorageLayout {
    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                        User Balance                        */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    // get user's balance
    function getBalance(
        address token,
        Permission memory permission
    ) external view onlySender(permission) returns (string memory) {
        // reencrypt and return
        return
            FHE.sealoutput(
                account[msg.sender].balanceOf[_address2bytes32(token)],
                permission.publicKey
            );
    }

    // get user's lp token balance
    function getLPBalance(
        address tokenX,
        address tokenY,
        Permission memory permission
    ) external view onlySender(permission) returns (string memory) {
        // reencrypt and return
        return
            FHE.sealoutput(
                account[msg.sender].balanceOf[_getPoolId(tokenX, tokenY)],
                permission.publicKey
            );
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                          Pool Info                         */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    // get pool id
    function getPoolId(
        address tokenX,
        address tokenY
    ) external view returns (bytes32) {
        return _getPoolId(tokenX, tokenY);
    }

    // get pool's current epoch and the last settlement time
    function getPoolInfo(bytes32 poolId) public view returns (uint32, uint32) {
        uint32 epoch = poolState[poolId].epoch;
        uint32 lastSettlement = poolState[poolId].lastSettlement;

        return (epoch, lastSettlement);
    }
    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                         User Orders                        */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    // get unclaimed orders' length
    function getUnclaimedOrdersLength() external view returns (uint256) {
        return account[msg.sender].unclaimedOrders.length;
    }

    // get unclaimed order
    function getUnclaimedOrder(
        uint256 index
    ) external view returns (unclaimedOrderStruct memory) {
        return account[msg.sender].unclaimedOrders[index];
    }

    // get unclaimed orders at once
    function getUnclaimedOrders()
        external
        view
        returns (unclaimedOrderForViewerStruct[] memory)
    {
        // get length
        uint len = account[msg.sender].unclaimedOrders.length;

        // create array
        unclaimedOrderForViewerStruct[]
            memory orders = new unclaimedOrderForViewerStruct[](len);

        // fill array
        bytes32 poolId;
        uint32 orderEpoch;
        uint32 poolEpoch;
        uint32 lastSettlement;
        for (uint i = 0; i < len; i++) {
            poolId = account[msg.sender].unclaimedOrders[i].poolId;
            orderEpoch = account[msg.sender].unclaimedOrders[i].epoch;
            (poolEpoch, lastSettlement) = getPoolInfo(poolId);
            orders[i].poolId = poolId;
            orders[i].orderEpoch = orderEpoch;
            orders[i].poolEpoch = poolEpoch;
            orders[i].lastSettlement = lastSettlement;
        }

        // return
        return orders;
    }

    // get number of unclaimed orders of protocol owned account
    function getUnclaimedProtocolOrdersLength()
        external
        view
        returns (uint256)
    {
        return account[address(this)].unclaimedOrders.length;
    }

    // get uncloimed order of protocol owned account
    function getUnclaimedProtocolOrder(
        uint256 index
    ) external view returns (unclaimedOrderStruct memory) {
        return account[address(this)].unclaimedOrders[index];
    }
}

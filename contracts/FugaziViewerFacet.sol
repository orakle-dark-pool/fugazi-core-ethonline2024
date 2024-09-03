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
}

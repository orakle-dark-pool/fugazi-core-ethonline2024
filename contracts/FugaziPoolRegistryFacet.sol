// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./FugaziStorageLayout.sol";

/// This facet will handle pool creation
contract FugaziPoolRegistryFacet is FugaziStorageLayout {
    function createPool(
        address tokenX,
        address tokenY,
        inEuint32 calldata _initialReserves
    ) external returns (bytes32) {
        /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
        /*                     Check requirements                     */
        /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

        // check if the input tokens are in right order
        if (tokenY <= tokenX) revert InvalidTokenOrder();

        // check if pool already exists
        bytes32 poolId = _getPoolId(tokenX, tokenY);
        if (poolId != bytes32(0)) revert PoolAlreadyExists();

        /* transform the type:
         smallest 15 bits = initial reserve of tokenY
         next 15 bits = initial reserve of tokenX
         we ignore the rest

         due to the formula of AMM, each token amount should satisfy the following condition:
         (max token in pool)^2 * 4 < 2^32 (or 2^64, 2^128, so on...)

         For the derivation of the formula, please refer to jupyter notebook 
         at https://github.com/kosunghun317/FMAMM_LVR/blob/main/notebooks/FMAMM_batch_math.ipynb
        */
        euint32 initialReserves = FHE.asEuint32(_initialReserves);

        // adjust the input; we cannot create a pool with reserves more than the caller has
        euint32 availableX = FHE.min(
            account[msg.sender].balanceOf[_address2bytes32(tokenX)],
            FHE.shr(
                FHE.and(initialReserves, FHE.asEuint32(1073709056)),
                FHE.asEuint32(15)
            ) // and(initialReserves, (2^30 - 1) - (2^15 - 1)) >> 15
        );
        euint32 availableY = FHE.min(
            account[msg.sender].balanceOf[_address2bytes32(tokenY)],
            FHE.and(initialReserves, FHE.asEuint32(32767)) // smallest 15 bits (32767 = 2 ** 15 - 1)
        );

        // minimum reserves: at least 2**feeBitShifts of each token
        // This is for taking strictly positive amount of fee in LP tokens
        // Taken LP tokens will become dead shares to prevent inflation attack.
        FHE.req(
            FHE.and(
                FHE.gt(availableX, FHE.asEuint32(2 << feeBitShifts)),
                FHE.gt(availableY, FHE.asEuint32(2 << feeBitShifts))
            )
        );

        /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
        /*                       Update Storage                       */
        /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

        // deduct the token balance of caller
        account[msg.sender].balanceOf[_address2bytes32(tokenX)] =
            account[msg.sender].balanceOf[_address2bytes32(tokenX)] -
            availableX;
        account[msg.sender].balanceOf[_address2bytes32(tokenY)] =
            account[msg.sender].balanceOf[_address2bytes32(tokenY)] -
            availableY;

        // update pool id mapping - pool is created at this point
        poolIdMapping[tokenX][tokenY] = keccak256(
            abi.encodePacked(tokenX, tokenY)
        );
        poolId = _getPoolId(tokenX, tokenY);

        // Now we have to initialize pool
        poolStateStruct storage $ = poolState[poolId];
        poolInitializationInputStruct memory i = poolInitializationInputStruct({
            tokenX: tokenX,
            tokenY: tokenY,
            initialReserveX: availableX,
            initialReserveY: availableY
        });
        _initializePool(poolId, $, i);

        // emit event
        emit PoolCreated(i.tokenX, i.tokenY, poolId);

        // return the id of created pool
        return poolId;
    }

    function _initializePool(
        bytes32 poolId,
        poolStateStruct storage $,
        poolInitializationInputStruct memory i
    ) internal {
        // set token addresses
        $.tokenX = i.tokenX;
        $.tokenY = i.tokenY;

        // set epoch & settlement time
        $.epoch = 0;
        $.lastSettlement = uint32(block.timestamp);

        // set reserves
        $.reserveX = i.initialReserveX;
        $.reserveY = i.initialReserveY;

        // mint LP token and take fee, which will be a dead share
        $.lpTotalSupply = FHE.max($.reserveX, $.reserveY); // sqrt is too expensive
        account[address(this)].balanceOf[poolId] =
            FHE.shr($.lpTotalSupply, FHE.asEuint32(feeBitShifts)) +
            FHE.asEuint32(1); // round up
        account[msg.sender].balanceOf[poolId] =
            $.lpTotalSupply -
            account[address(this)].balanceOf[poolId];
    }
}

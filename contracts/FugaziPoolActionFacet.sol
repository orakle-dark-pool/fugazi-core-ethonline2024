// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./FugaziStorageLayout.sol";

/// This contract handles settlement of batch and claim of filled orders
/// Anyone can make protocol-owned account's unclaimed orders to be claimed
/// and get small portion of it as reward
contract FugaziPoolActionFacet is FugaziStorageLayout {
    function toggleNoiseOrder(bool on) external onlyOwner {
        activateNoiseOrder = on;
    }

    function settleBatch(bytes32 poolId) external onlyValidPool(poolId) {
        // load the pool
        poolStateStruct storage $ = poolState[poolId];
        batchStruct storage batch = $.batch[$.epoch];

        // check if enough time has passed
        if (block.timestamp < $.lastSettlement + epochTime)
            revert EpochNotEnded();

        // read reserves and set them as initial values of the batch
        // taken fee is added to initial reserves
        // to prevent JIT liquidity provision to earn fee
        batch.reserveX0 = $.reserveX + batch.feeX;
        batch.reserveY0 = $.reserveY + batch.feeY;

        // calculate the intermediate values
        batch.XForPricing =
            batch.reserveX0 +
            FHE.shl(batch.swapX, FHE.asEuint32(1)) +
            batch.mintX; // x0 + 2 * x_swap + x_mint
        batch.YForPricing =
            batch.reserveY0 +
            FHE.shl(batch.swapY, FHE.asEuint32(1)) +
            batch.mintY; // y0 + 2 * y_swap + y_mint

        // calculate the output amounts
        batch.outX = (batch.swapY * batch.XForPricing) / batch.YForPricing;
        batch.outY = (batch.swapX * batch.YForPricing) / batch.XForPricing;

        // calculate the final reserves of the batch
        batch.reserveX1 =
            batch.reserveX0 +
            batch.swapX +
            batch.mintX -
            batch.outX;
        batch.reserveY1 =
            batch.reserveY0 +
            batch.swapY +
            batch.mintY -
            batch.outY;

        // update the pool state
        $.reserveX = batch.reserveX1 + FHE.asEuint32(0);
        $.reserveY = batch.reserveY1 + FHE.asEuint32(0);

        /*
         mint the LP token for this epoch
         this will be distributed to traders once they claim their orders
        */
        batch.lpIncrement = FHE.min(
            ($.lpTotalSupply * batch.mintX) / batch.reserveX0,
            ($.lpTotalSupply * batch.mintY) / batch.reserveY0
        );

        /*
        Although this is underestimation, it is the best we can do currently,
        since encrypted operation is too expensive to handle the muldiv without overflow.
        The correct way to calculate the LP increment is:
        t = T 
            * (x_0 * y_mint + 2 * x_swap * y_mint + x_mint * y_0 + 2 * x_mint * y_swap + 2 * x_mint * y_mint) 
            / (2 * x_0 * y_0 + 2 * x_0 * y_swap + 2 * x_swap * y_0 + x_0 * y_mint + x_mint * y_0)
        See https://github.com/kosunghun317/alternative_AMMs/blob/master/notes/FMAMM_batch_math.ipynb for derivation.
        */
        $.lpTotalSupply = $.lpTotalSupply + batch.lpIncrement;
        _increaseUserBalance(address(this), poolId, batch.lpIncrement);

        // increment the epoch
        $.epoch += 1;
        $.lastSettlement = uint32(block.timestamp);

        emit batchSettled(poolId, $.epoch - 1);
    }

    function claim(
        bytes32 poolId,
        uint32 epoch
    ) external onlyValidPool(poolId) {
        _claim(poolId, epoch, msg.sender);
    }

    function claimProtocolOrder(
        bytes32 poolId,
        uint32 epoch
    ) external onlyValidPool(poolId) {
        // claim
        (euint32 claimableX, euint32 claimableY, ) = _claim(
            poolId,
            epoch,
            address(this)
        );

        // calculate the reward
        euint32 rewardX = FHE.shr(claimableX, FHE.asEuint32(feeBitShifts));
        euint32 rewardY = FHE.shr(claimableY, FHE.asEuint32(feeBitShifts));

        // deduct protocol owned acccount's balance
        poolStateStruct storage $ = poolState[poolId];
        $.protocolX = $.protocolX - rewardX;
        $.protocolY = $.protocolY - rewardY;

        // reward the caller
        _increaseUserBalance(msg.sender, _address2bytes32($.tokenX), rewardX);
        _increaseUserBalance(msg.sender, _address2bytes32($.tokenY), rewardY);
    }

    function _claim(
        bytes32 poolId,
        uint32 epoch,
        address trader
    ) internal returns (euint32, euint32, euint32) {
        // get the pool and epoch
        poolStateStruct storage $ = poolState[poolId];
        batchStruct storage batch = $.batch[epoch];

        // check if the epoch is already settled
        if (epoch >= $.epoch) revert EpochNotEnded();

        // check if order is already claimed
        if (batch.order[trader].claimed) revert OrderAlreadyClaimed();

        // mark the order as claimed
        batch.order[trader].claimed = true;
        _removeUnclaimedOrder(trader, poolId, epoch);

        // claim the output amount from the batch
        euint32 claimableX = (batch.order[trader].swapY * batch.XForPricing) /
            batch.YForPricing;
        euint32 claimableY = (batch.order[trader].swapX * batch.YForPricing) /
            batch.XForPricing;

        if (trader != address(this)) {
            _increaseUserBalance(
                trader,
                _address2bytes32($.tokenX),
                claimableX
            );
            _increaseUserBalance(
                trader,
                _address2bytes32($.tokenY),
                claimableY
            );
        } else {
            $.protocolX = $.protocolX + claimableX;
            $.protocolY = $.protocolY + claimableY;
        }

        // claim the lp token from the batch
        euint32 claimableLP = FHE.min(
            (batch.lpIncrement * batch.order[trader].mintX) /
                FHE.max(batch.mintX, FHE.asEuint32(1)), // to prevent division by zero
            (batch.lpIncrement * batch.order[trader].mintY) /
                FHE.max(batch.mintY, FHE.asEuint32(1)) // to prevent division by zero
        ); /*
            Again, this is underestimation. Correct formula will be used once the gas usage becomes affordable.
           */
        _decreaseUserBalance(address(this), poolId, claimableLP);
        _increaseUserBalance(trader, poolId, claimableLP);

        // emit event
        emit orderClaimed(poolId, epoch, trader);

        return (claimableX, claimableY, claimableLP);
    }
    function _removeUnclaimedOrder(
        address trader,
        bytes32 poolId,
        uint32 epoch
    ) internal {
        accountStruct storage $ = account[trader];

        // find the order and remove it
        for (uint256 i = 0; i < $.unclaimedOrders.length; i++) {
            if (
                $.unclaimedOrders[i].poolId == poolId &&
                $.unclaimedOrders[i].epoch == epoch
            ) {
                $.unclaimedOrders[i] = $.unclaimedOrders[
                    $.unclaimedOrders.length - 1
                ];
                $.unclaimedOrders.pop();
                break;
            }
        }
    }
}

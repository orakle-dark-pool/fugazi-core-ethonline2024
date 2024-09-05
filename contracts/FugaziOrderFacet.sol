// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./FugaziStorageLayout.sol";

/// This contract handles order submission, which is settled in batch,
/// and removeLiquidity, which can be filled immidiately.
/// Orders are batched since they may affect the pool price,
/// while removeLiquidity does not.
contract FugaziOrderFacet is FugaziStorageLayout {
    function removeLiquidity(
        bytes32 poolId,
        inEuint32 calldata _exitAmount
    ) external onlyValidPool(poolId) {
        // get the pool
        poolStateStruct storage $ = poolState[poolId];

        // adjust the amount; u cannot burn more than you have!
        euint32 exitAmount = FHE.asEuint32(_exitAmount);
        exitAmount = FHE.min(exitAmount, account[msg.sender].balanceOf[poolId]);

        // calculate the amount of tokenX and tokenY to be released
        euint32 releaseX = FHE.div(
            FHE.mul(exitAmount, $.reserveX),
            $.lpTotalSupply
        );
        euint32 releaseY = FHE.div(
            FHE.mul(exitAmount, $.reserveY),
            $.lpTotalSupply
        );

        // burn the LP token and update total supply
        account[msg.sender].balanceOf[poolId] =
            account[msg.sender].balanceOf[poolId] -
            exitAmount;
        $.lpTotalSupply = $.lpTotalSupply - exitAmount;

        // update the reserves & account token balance
        $.reserveX = $.reserveX - releaseX;
        $.reserveY = $.reserveY - releaseY;
        account[msg.sender].balanceOf[_address2bytes32($.tokenX)] =
            account[msg.sender].balanceOf[_address2bytes32($.tokenX)] +
            releaseX;
        account[msg.sender].balanceOf[_address2bytes32($.tokenY)] =
            account[msg.sender].balanceOf[_address2bytes32($.tokenY)] +
            releaseY;
    }

    function submitOrder(
        bytes32 poolId,
        inEuint64 calldata _packedAmounts
    ) external onlyValidPool(poolId) returns (uint32) {
        // transform the type
        euint64 packedAmounts = FHE.asEuint64(_packedAmounts);

        /*
         smallest 15 bits = amount of tokenY
         next 15 bits = amount of tokenX
         next 1 bit = isSwap: 0 for swap, 1 for addLiquidity
         next 1 bit = isNoiseReferenceX: 0 for yes, 1 for no
         next 11 bit = noiseAmplitude: maximum 2047, 
         which corresponds to (2-ε) times of submitted order size
         e.g.) 
            if spot price of pool is 123
            and amount of tokenX == 100
            and isNoiseReferenceX == 0 
            and noiseAmplitude == 1024
            then the protocol owned account will randomly
            sell 100 tokenX or sell 12300 tokenY.
        */
        unpackedOrderStruct memory unpackedOrder;
        unpackedOrder.amountY = FHE.asEuint32(
            FHE.and(packedAmounts, FHE.asEuint64(32767)) // 2^15 - 1
        );
        unpackedOrder.amountX = FHE.shr(
            FHE.asEuint32(
                FHE.and(
                    packedAmounts,
                    FHE.asEuint64(1073709056) // 2^30 - 1 - (2^15 - 1)
                )
            ),
            FHE.asEuint32(15)
        );
        unpackedOrder.isSwap = FHE.eq(
            FHE.and(packedAmounts, FHE.asEuint64(1073741824)), // 2^30
            FHE.asEuint64(0)
        );
        unpackedOrder.isNoiseReferenceX = FHE.eq(
            FHE.and(packedAmounts, FHE.asEuint64(2147483648)), // 2^31
            FHE.asEuint64(0)
        );
        unpackedOrder.noiseAmplitude = FHE.asEuint32(
            FHE.shr(
                FHE.and(
                    packedAmounts,
                    FHE.asEuint64(17583596109824) // (2^43 - 1) - (2^32 - 1)
                ),
                FHE.asEuint64(32)
            )
        );

        // get the pool and epoch
        poolStateStruct storage $ = poolState[poolId];
        batchStruct storage batch = $.batch[$.epoch];

        // add the noise order first. Privacy fee is charged at this point.
        _addNoiseOrder(unpackedOrder, $, batch);

        // adjust the amount; u cannot sell or mint more than you have!
        unpackedOrder.amountX = FHE.min(
            unpackedOrder.amountX,
            account[msg.sender].balanceOf[_address2bytes32($.tokenX)]
        );
        unpackedOrder.amountY = FHE.min(
            unpackedOrder.amountY,
            account[msg.sender].balanceOf[_address2bytes32($.tokenY)]
        );

        // take swap fee
        unpackedOrderStruct memory newUnpackedOrder = _chargeSwapFee(
            $,
            batch,
            unpackedOrder
        );

        // deduct the balance from user account
        account[msg.sender].balanceOf[_address2bytes32($.tokenX)] =
            account[msg.sender].balanceOf[_address2bytes32($.tokenX)] -
            newUnpackedOrder.amountX;
        account[msg.sender].balanceOf[_address2bytes32($.tokenY)] =
            account[msg.sender].balanceOf[_address2bytes32($.tokenY)] -
            newUnpackedOrder.amountY;

        // update the trader's order in the batch
        batch.order[msg.sender].swapX = FHE.select(
            unpackedOrder.isSwap,
            unpackedOrder.amountX,
            FHE.asEuint32(0)
        );
        batch.order[msg.sender].swapY = FHE.select(
            unpackedOrder.isSwap,
            unpackedOrder.amountY,
            FHE.asEuint32(0)
        );
        batch.order[msg.sender].mintX = FHE.select(
            unpackedOrder.isSwap,
            FHE.asEuint32(0),
            unpackedOrder.amountX
        );
        batch.order[msg.sender].mintY = FHE.select(
            unpackedOrder.isSwap,
            FHE.asEuint32(0),
            unpackedOrder.amountY
        );
        batch.order[msg.sender].claimed = false;

        // update the aggregated orders in the batch
        batch.swapX = batch.swapX + batch.order[msg.sender].swapX;
        batch.swapY = batch.swapY + batch.order[msg.sender].swapY;
        batch.mintX = batch.mintX + batch.order[msg.sender].mintX;
        batch.mintY = batch.mintY + batch.order[msg.sender].mintY;

        // if this is the first order of epoch from trader then add the unclaimed order
        _addUnclaimedOrder(msg.sender, poolId, $.epoch);

        // emit event
        emit orderSubmitted(poolId, $.epoch);

        // return the epoch of the order received
        return $.epoch;
    }

    function _addNoiseOrder(
        unpackedOrderStruct memory unpackedOrder,
        poolStateStruct storage $,
        batchStruct storage batch
    ) internal {
        // compute the size of noise order on each side
        (euint32 noiseX, euint32 noiseY) = _computeNoiseOrderSize(
            unpackedOrder,
            $
        );

        // compute the fee
        (euint32 feeX, euint32 feeY) = _computePrivacyFee(
            noiseX,
            noiseY,
            unpackedOrder,
            $
        );

        // tranfer the fee from user balance to protocol account
        _chargePrivacyFee(feeX, feeY, $);

        // submit order from protocol account
        _submitNoiseOrder(noiseX, noiseY, $, batch);
    }

    function _computeNoiseOrderSize(
        unpackedOrderStruct memory unpackedOrder,
        poolStateStruct storage $
    ) internal view returns (euint32 noiseX, euint32 noiseY) {
        noiseX = FHE.shr(
            FHE.select(
                unpackedOrder.isNoiseReferenceX,
                unpackedOrder.amountX,
                FHE.asEuint32(0)
            ) * unpackedOrder.noiseAmplitude,
            FHE.asEuint32(10)
        );
        noiseY = FHE.shr(
            FHE.select(
                unpackedOrder.isNoiseReferenceX,
                FHE.asEuint32(0),
                unpackedOrder.amountY
            ) * unpackedOrder.noiseAmplitude,
            FHE.asEuint32(10)
        );
        noiseX = noiseX + (noiseY * $.reserveX) / $.reserveY;
        noiseY = noiseY + (noiseX * $.reserveY) / $.reserveX;
    }

    function _computePrivacyFee(
        euint32 noiseX,
        euint32 noiseY,
        unpackedOrderStruct memory unpackedOrder,
        poolStateStruct storage $
    ) internal view returns (euint32, euint32) {
        euint32 feeX = FHE.select(
            unpackedOrder.isNoiseReferenceX,
            ((noiseX * noiseY) / $.reserveY) + FHE.asEuint32(1), // round up
            FHE.asEuint32(0)
        );
        euint32 feeY = FHE.select(
            unpackedOrder.isNoiseReferenceX,
            FHE.asEuint32(0),
            ((noiseX * noiseY) / $.reserveX) + FHE.asEuint32(1) // round up
        );

        return (feeX, feeY);
    }

    function _chargePrivacyFee(
        euint32 feeX,
        euint32 feeY,
        poolStateStruct storage $
    ) internal {
        // trader must have enough balance to pay the fee
        FHE.req(
            FHE.gt(
                account[msg.sender].balanceOf[_address2bytes32($.tokenX)],
                feeX
            )
        );
        FHE.req(
            FHE.gt(
                account[msg.sender].balanceOf[_address2bytes32($.tokenY)],
                feeY
            )
        );

        // deduct the fee from user balance...
        account[msg.sender].balanceOf[_address2bytes32($.tokenX)] =
            account[msg.sender].balanceOf[_address2bytes32($.tokenX)] -
            feeX;
        account[msg.sender].balanceOf[_address2bytes32($.tokenY)] =
            account[msg.sender].balanceOf[_address2bytes32($.tokenY)] -
            feeY;

        // and add it to protocol owned account
        $.protocolX = $.protocolX + feeX;
        $.protocolY = $.protocolY + feeY;
    }

    function _submitNoiseOrder(
        euint32 noiseX,
        euint32 noiseY,
        poolStateStruct storage $,
        batchStruct storage batch
    ) internal {
        // toss the coin
        euint32 coin = _coinToss();

        // we cannot sell more than we have
        euint32 availableX = FHE.min(coin * noiseX, $.protocolX);
        euint32 availableY = FHE.min(coin * noiseY, $.protocolY);

        // deduct the balance from protocol account
        $.protocolX = $.protocolX - availableX;
        $.protocolY = $.protocolY - availableY;

        // record the order into the batch
        batch.order[address(this)].swapX = availableX;
        batch.order[address(this)].swapY = availableY;
        batch.order[address(this)].claimed = false;

        batch.swapX = batch.swapX + availableX;
        batch.swapY = batch.swapY + availableY;

        // if this is the first order of epoch from trader then update the unclaimed order list
        _addUnclaimedOrder(
            address(this),
            _getPoolId($.tokenX, $.tokenY),
            $.epoch
        );
    }

    function _coinToss() internal view returns (euint32) {
        return FHE.shr(_getFakeRandomU32(), FHE.asEuint32(31));
    }

    function _getFakeRandomU32() internal view returns (euint32) {
        uint32 blockHash = uint32(_getFakeRandom());
        return FHE.asEuint32(blockHash);
    }

    function _getFakeRandom() internal view returns (uint256) {
        uint blockNumber = block.number;
        uint256 blockHash = uint256(blockhash(blockNumber));

        return blockHash;
    }

    function _addUnclaimedOrder(
        address trader,
        bytes32 poolId,
        uint32 epoch
    ) internal {
        accountStruct storage $ = account[trader];

        // check if the order is already in the unclaimed order list
        uint256 orderCount = 0;
        for (uint256 i = 0; i < $.unclaimedOrders.length; i++) {
            if (
                $.unclaimedOrders[i].poolId == poolId &&
                $.unclaimedOrders[i].epoch == epoch
            ) {
                orderCount++;
                break;
            }
        }

        // if not, add the order
        if (orderCount == 0) {
            $.unclaimedOrders.push(
                unclaimedOrderStruct({poolId: poolId, epoch: epoch})
            );
        }
    }

    function _chargeSwapFee(
        poolStateStruct storage $,
        batchStruct storage batch,
        unpackedOrderStruct memory unpackedOrder
    ) internal returns (unpackedOrderStruct memory orderAfterSwapFee) {
        // compute fee
        euint32 feeX = FHE.shr(
            unpackedOrder.amountX,
            FHE.asEuint32(feeBitShifts)
        );
        euint32 feeY = FHE.shr(
            unpackedOrder.amountY,
            FHE.asEuint32(feeBitShifts)
        );

        // no need to check the feasibility of fee deduction

        // deduct the fee from user balance...
        account[msg.sender].balanceOf[_address2bytes32($.tokenX)] =
            account[msg.sender].balanceOf[_address2bytes32($.tokenX)] -
            feeX;
        account[msg.sender].balanceOf[_address2bytes32($.tokenY)] =
            account[msg.sender].balanceOf[_address2bytes32($.tokenY)] -
            feeY;

        // half goes to protocol account
        $.protocolX = $.protocolX + FHE.shr(feeX, FHE.asEuint32(1));
        $.protocolY = $.protocolY + FHE.shr(feeY, FHE.asEuint32(1));

        // record the rest in batch
        batch.feeX = batch.feeX + feeX - FHE.shr(feeX, FHE.asEuint32(1));
        batch.feeY = batch.feeY + feeY - FHE.shr(feeY, FHE.asEuint32(1));

        orderAfterSwapFee.isSwap = unpackedOrder.isSwap;
        orderAfterSwapFee.amountX = unpackedOrder.amountX - feeX;
        orderAfterSwapFee.amountY = unpackedOrder.amountY - feeY;
    }
}

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
        _decreaseUserBalance(msg.sender, poolId, exitAmount);
        $.lpTotalSupply = $.lpTotalSupply - exitAmount;

        // update the reserves & account token balance
        $.reserveX = $.reserveX - releaseX;
        $.reserveY = $.reserveY - releaseY;
        _increaseUserBalance(msg.sender, _address2bytes32($.tokenX), releaseX);
        _increaseUserBalance(msg.sender, _address2bytes32($.tokenY), releaseY);

        // emit event
        emit liquidityRemoved(poolId, $.epoch);
    }

    function submitOrder(
        bytes32 poolId,
        inEuint64 calldata _packedAmounts
    ) external onlyValidPool(poolId) returns (uint32) {
        // get the pool and epoch
        poolStateStruct storage $ = poolState[poolId];
        batchStruct storage batch = $.batch[$.epoch];

        // unpack the input
        unpackedOrderStruct memory unpackedOrder = _unpackOrder(_packedAmounts);

        // add the noise order first. Privacy fee is charged at this point.
        if (activateNoiseOrder) {
            _addNoiseOrder(unpackedOrder, $, batch);
        }

        // take swap fee
        unpackedOrderStruct memory newUnpackedOrder = _chargeSwapFee(
            $,
            batch,
            unpackedOrder
        );

        // deduct the balance from user account
        _decreaseUserBalance(
            msg.sender,
            _address2bytes32($.tokenX),
            newUnpackedOrder.amountX
        );
        _decreaseUserBalance(
            msg.sender,
            _address2bytes32($.tokenY),
            newUnpackedOrder.amountY
        );

        // update the trader's order in the batch
        _updateUserOrder(newUnpackedOrder, batch, msg.sender);

        // update the aggregated orders in the batch
        _updateBatch(newUnpackedOrder, batch);

        // if this is the first order of epoch from trader then add the unclaimed order
        _addUnclaimedOrder(msg.sender, poolId, $.epoch);

        // emit event
        emit orderSubmitted(poolId, $.epoch);

        // return the epoch of the order received
        return $.epoch;
    }

    function _unpackOrder(
        inEuint64 calldata _packedAmounts
    ) internal pure returns (unpackedOrderStruct memory) {
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
            fee will be charged in tokenX.
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
            FHE.and(packedAmounts, FHE.asEuint64(2147483648)), // 2^31 (32'th bit)
            FHE.asEuint64(0)
        );
        unpackedOrder.noiseAmplitude = FHE.asEuint32(
            FHE.shr(
                FHE.and(
                    packedAmounts,
                    FHE.asEuint64(8791798054912) // (2^43 - 1) - (2^32 - 1)
                ),
                FHE.asEuint64(32)
            )
        );

        return unpackedOrder;
    }

    function _chargeSwapFee(
        poolStateStruct storage $,
        batchStruct storage batch,
        unpackedOrderStruct memory unpackedOrder
    ) internal returns (unpackedOrderStruct memory orderAfterSwapFee) {
        // adjust the amount; u cannot sell or mint more than you have!
        unpackedOrder.amountX = FHE.min(
            unpackedOrder.amountX,
            account[msg.sender].balanceOf[_address2bytes32($.tokenX)]
        );
        unpackedOrder.amountY = FHE.min(
            unpackedOrder.amountY,
            account[msg.sender].balanceOf[_address2bytes32($.tokenY)]
        );

        // compute fee
        euint32 feeX = FHE.shr(
            unpackedOrder.amountX,
            FHE.asEuint32(feeBitShifts)
        );
        euint32 feeY = FHE.shr(
            unpackedOrder.amountY,
            FHE.asEuint32(feeBitShifts)
        );

        // deduct the fee from user balance...
        _decreaseUserBalance(msg.sender, _address2bytes32($.tokenX), feeX);
        _decreaseUserBalance(msg.sender, _address2bytes32($.tokenY), feeY);

        // half goes to protocol account
        euint32 protocolShareX = FHE.shr(feeX, FHE.asEuint32(1));
        euint32 protocolShareY = FHE.shr(feeY, FHE.asEuint32(1));
        $.protocolX = $.protocolX + protocolShareX;
        $.protocolY = $.protocolY + protocolShareY;

        // record the rest in batch
        batch.feeX = batch.feeX + feeX - protocolShareX;
        batch.feeY = batch.feeY + feeY - protocolShareY;

        orderAfterSwapFee.isSwap = unpackedOrder.isSwap;
        orderAfterSwapFee.amountX = unpackedOrder.amountX - feeX;
        orderAfterSwapFee.amountY = unpackedOrder.amountY - feeY;
    }

    function _updateUserOrder(
        unpackedOrderStruct memory unpackedOrder,
        batchStruct storage batch,
        address trader
    ) internal {
        // update the trader's order in the batch
        batch.order[trader].swapX =
            batch.order[trader].swapX +
            FHE.select(
                unpackedOrder.isSwap,
                unpackedOrder.amountX,
                FHE.asEuint32(0)
            );
        batch.order[trader].swapY =
            batch.order[trader].swapY +
            FHE.select(
                unpackedOrder.isSwap,
                unpackedOrder.amountY,
                FHE.asEuint32(0)
            );
        batch.order[trader].mintX =
            batch.order[trader].mintX +
            FHE.select(
                unpackedOrder.isSwap,
                FHE.asEuint32(0),
                unpackedOrder.amountX
            );
        batch.order[trader].mintY =
            batch.order[trader].mintY +
            FHE.select(
                unpackedOrder.isSwap,
                FHE.asEuint32(0),
                unpackedOrder.amountY
            );
        batch.order[trader].claimed = false;
    }

    function _updateBatch(
        unpackedOrderStruct memory unpackedOrder,
        batchStruct storage batch
    ) internal {
        batch.swapX =
            batch.swapX +
            FHE.select(
                unpackedOrder.isSwap,
                unpackedOrder.amountX,
                FHE.asEuint32(0)
            );
        batch.swapY =
            batch.swapY +
            FHE.select(
                unpackedOrder.isSwap,
                unpackedOrder.amountY,
                FHE.asEuint32(0)
            );
        batch.mintX =
            batch.mintX +
            FHE.select(
                unpackedOrder.isSwap,
                FHE.asEuint32(0),
                unpackedOrder.amountX
            );
        batch.mintY =
            batch.mintY +
            FHE.select(
                unpackedOrder.isSwap,
                FHE.asEuint32(0),
                unpackedOrder.amountY
            );
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
        noiseX = FHE.select(
            unpackedOrder.isNoiseReferenceX,
            FHE.shr(
                unpackedOrder.amountX * unpackedOrder.noiseAmplitude,
                FHE.asEuint32(10)
            ),
            FHE.asEuint32(0)
        );
        noiseY = FHE.select(
            unpackedOrder.isNoiseReferenceX,
            FHE.asEuint32(0),
            FHE.shr(
                unpackedOrder.amountY * unpackedOrder.noiseAmplitude,
                FHE.asEuint32(10)
            )
        );
        noiseX = FHE.select(
            unpackedOrder.isNoiseReferenceX,
            noiseX,
            (noiseY * $.reserveX) / $.reserveY
        );
        noiseY = FHE.select(
            unpackedOrder.isNoiseReferenceX,
            (noiseX * $.reserveY) / $.reserveX,
            noiseY
        );
    }

    function _computePrivacyFee(
        euint32 noiseX,
        euint32 noiseY,
        unpackedOrderStruct memory unpackedOrder,
        poolStateStruct storage $
    ) internal view returns (euint32, euint32) {
        euint32 feeX = FHE.select(
            unpackedOrder.isNoiseReferenceX,
            ((noiseX * noiseY) / $.reserveY),
            FHE.asEuint32(0)
        );
        euint32 feeY = FHE.select(
            unpackedOrder.isNoiseReferenceX,
            FHE.asEuint32(0),
            ((noiseX * noiseY) / $.reserveX)
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
            FHE.gte(
                account[msg.sender].balanceOf[_address2bytes32($.tokenX)],
                feeX
            )
        );
        FHE.req(
            FHE.gte(
                account[msg.sender].balanceOf[_address2bytes32($.tokenY)],
                feeY
            )
        );

        // deduct the fee from user balance...
        _decreaseUserBalance(msg.sender, _address2bytes32($.tokenX), feeX);
        _decreaseUserBalance(msg.sender, _address2bytes32($.tokenY), feeY);

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
        euint32 availableY = FHE.min(
            (FHE.asEuint32(1) - coin) * noiseY,
            $.protocolY
        );

        // deduct the balance from protocol account
        $.protocolX = $.protocolX - availableX;
        $.protocolY = $.protocolY - availableY;

        // record the order into the batch
        batch.order[address(this)].swapX =
            batch.order[address(this)].swapX +
            availableX;
        batch.order[address(this)].swapY =
            batch.order[address(this)].swapY +
            availableY;
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
        return FHE.and(_getFakeRandomU32(), FHE.asEuint32(1));
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
}

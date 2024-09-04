// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./FugaziStorageLayout.sol";
import {IFHERC20} from "./interfaces/IFHERC20.sol";

/// This contract will handle deposit and withdrawal of user fund.
/// Currently supports old version of FHERC20 only, since our AMM
/// cannot handle big numbers (supports up to euint32 currently)
contract FugaziBalanceFacet is FugaziStorageLayout {
    // deposit
    function deposit(
        address recipient,
        address token,
        inEuint32 calldata _amount
    ) external {
        // transferFrom
        euint32 spent = IFHERC20(token).transferFromEncrypted(
            msg.sender,
            address(this),
            _amount
        );

        // update storage
        account[msg.sender].balanceOf[_address2bytes32(token)] =
            account[msg.sender].balanceOf[_address2bytes32(token)] +
            spent;

        // emit event
        emit Deposit(recipient, token);
    }

    // withdraw
    function withdraw(
        address recipient,
        address token,
        inEuint32 calldata _amount
    ) external {
        // decode and adjust amount
        euint32 amount = FHE.asEuint32(_amount);
        amount = FHE.min(
            amount,
            account[msg.sender].balanceOf[_address2bytes32(token)]
        ); // you cannot withdraw more than you have

        // update storage
        account[msg.sender].balanceOf[_address2bytes32(token)] =
            account[msg.sender].balanceOf[_address2bytes32(token)] -
            amount;

        // transfer
        IFHERC20(token).transferEncrypted(recipient, amount);

        // emit event
        emit Withdraw(recipient, token);
    }

    // donateToProtocol
    function donateToProtocol(
        bytes32 poolId,
        inEuint32 calldata _amount
    ) external onlyValidPool(poolId) {
        // load pool
        poolStateStruct storage $ = poolState[poolId];

        // transform type
        euint32 amount = FHE.asEuint32(_amount);
        euint32 availableX = FHE.min(
            account[msg.sender].balanceOf[_address2bytes32($.tokenX)],
            FHE.shr(
                FHE.and(amount, FHE.asEuint32(1073709056)),
                FHE.asEuint32(15)
            ) // and(initialReserves, (2^30 - 1) - (2^15 - 1)) >> 15
        );
        euint32 availableY = FHE.min(
            account[msg.sender].balanceOf[_address2bytes32($.tokenY)],
            FHE.and(amount, FHE.asEuint32(32767)) // smallest 15 bits (32767 = 2 ** 15 - 1)
        );

        // deduct user balance
        account[msg.sender].balanceOf[_address2bytes32($.tokenX)] =
            account[msg.sender].balanceOf[_address2bytes32($.tokenX)] -
            availableX;
        account[msg.sender].balanceOf[_address2bytes32($.tokenY)] =
            account[msg.sender].balanceOf[_address2bytes32($.tokenY)] -
            availableY;

        // update protocol balance
        $.protocolX = $.protocolX + availableX;
        $.protocolY = $.protocolY + availableY;
    }

    // Harvest
    function harvest(bytes32 poolId) external onlyOwner onlyValidPool(poolId) {
        // owner (or dao-owned account) can harvest protocol owned tokens
        poolStateStruct storage $ = poolState[poolId];
        if (block.timestamp < $.lastHarvest + harvestInterval)
            revert TooEarlyHarvest();

        // reward will be 1/16 current protocol balance
        euint32 rewardX = FHE.shr($.protocolX, FHE.asEuint32(4));
        euint32 rewardY = FHE.shr($.protocolY, FHE.asEuint32(4));

        // deduct protocol balance
        $.protocolX = $.protocolX - rewardX;
        $.protocolY = $.protocolY - rewardY;

        // add the reward to caller(i.e., owner)'s balance
        account[msg.sender].balanceOf[_address2bytes32($.tokenX)] =
            account[msg.sender].balanceOf[_address2bytes32($.tokenX)] +
            rewardX;
        account[msg.sender].balanceOf[_address2bytes32($.tokenY)] =
            account[msg.sender].balanceOf[_address2bytes32($.tokenY)] +
            rewardY;
    }
}

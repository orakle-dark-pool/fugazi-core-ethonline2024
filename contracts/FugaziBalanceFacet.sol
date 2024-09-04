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
        address token,
        inEuint32 calldata _amount
    ) external onlyValidPool(poolId) {
        // transform type
        euint32 amount = FHE.asEuint32(_amount);

        // deduct user balance
        account[msg.sender].balanceOf[_address2bytes32(token)] =
            account[msg.sender].balanceOf[_address2bytes32(token)] -
            amount;

        // load pool
        poolStateStruct storage $ = poolState[poolId];

        // update protocol balance
        if (token == $.tokenX) {
            $.protocolX = $.protocolX + amount;
        } else {
            $.protocolY = $.protocolY + amount;
        }
    }

    // Harvest
    function harvest(bytes32 poolId) external onlyOwner onlyValidPool(poolId) {
        // TBD
    }
}

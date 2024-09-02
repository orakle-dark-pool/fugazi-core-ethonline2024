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
        account[msg.sender].balanceOf[addr2bytes32(token)] =
            account[msg.sender].balanceOf[addr2bytes32(token)] +
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
            account[msg.sender].balanceOf[addr2bytes32(token)]
        ); // you cannot withdraw more than you have

        // update storage
        account[msg.sender].balanceOf[addr2bytes32(token)] =
            account[msg.sender].balanceOf[addr2bytes32(token)] -
            amount;

        // transfer
        IFHERC20(token).transferEncrypted(recipient, amount);

        // emit event
        emit Withdraw(recipient, token);
    }

    // auxiliary function for conversion
    function addr2bytes32(address addr) internal pure returns (bytes32) {
        return bytes32(bytes20(uint160(addr))) >> 96;
    }
}

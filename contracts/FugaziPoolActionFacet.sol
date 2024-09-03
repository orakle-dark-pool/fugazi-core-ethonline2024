// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./FugaziStorageLayout.sol";

/// This contract handles settlement of batch and claim of filled orders
/// Anyone can make protocol-owned account's unclaimed orders to be claimed
/// and get small portion of it as reward
contract FugaziPoolActionFacet is FugaziStorageLayout {
    function settleBatch(bytes32 poolId) external onlyValidPool(poolId) {}
}

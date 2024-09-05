// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@fhenixprotocol/contracts/FHE.sol";
import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";

/// This contract will be used to store all the storage variables
/// and auxiliary internal functions. This must be inherited by
/// all of the other contracts. Every library should be imported here, too.
contract FugaziStorageLayout is Permissioned {
    // import FHE library
    using FHE for euint32;
    using FHE for euint64;

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                            Core                            */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    // errors
    error noCorrespondingFacet();
    error notOwner();

    // events
    event facetAdded(bytes4 selector, address facet);

    // modifiers
    modifier onlyOwner() {
        if (msg.sender != owner) revert notOwner();
        _;
    }

    // structs
    struct facetAndSelectorStruct {
        address facet;
        bytes4 selector;
    }

    // storage variables
    address internal owner;
    mapping(bytes4 => address) internal selectorTofacet;

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                        Balance Facet                       */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    // errors

    // events
    event Deposit(address recipient, address token);
    event Withdraw(address recipient, address token);
    event Donation(bytes32 poolId);
    event Harvest(bytes32 poolId);

    // modifiers

    // structs
    struct accountStruct {
        mapping(bytes32 => euint32) balanceOf; // token (or LP) address => balance
        unclaimedOrderStruct[] unclaimedOrders;
    }

    // storage variables
    mapping(address => accountStruct) internal account;

    // functions
    function _address2bytes32(address addr) internal pure returns (bytes32) {
        return bytes32(bytes20(uint160(addr))) >> 96;
    }

    function _increaseUserBalance(
        address user,
        bytes32 token,
        euint32 amount
    ) internal {
        account[user].balanceOf[token] =
            account[user].balanceOf[token] +
            amount;
    }

    function _decreaseUserBalance(
        address user,
        bytes32 token,
        euint32 amount
    ) internal {
        account[user].balanceOf[token] =
            account[user].balanceOf[token] -
            amount;
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                    Pool Registry Facet                     */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    // errors
    error InvalidTokenOrder();
    error PoolAlreadyExists();
    error TooEarlyHarvest();

    // events
    event PoolCreated(address tokenX, address tokenY, bytes32 poolId);

    // modifiers

    // structs
    struct poolInitializationInputStruct {
        address tokenX;
        address tokenY;
        euint32 initialReserveX;
        euint32 initialReserveY;
    }

    struct poolStateStruct {
        // pool info
        address tokenX;
        address tokenY;
        uint32 epoch;
        uint32 lastSettlement;
        uint32 lastHarvest;
        // protocol account
        euint32 protocolX;
        euint32 protocolY;
        // pool reserves
        euint32 reserveX;
        euint32 reserveY;
        // total supply of LP tokens
        euint32 lpTotalSupply;
        // information of each batch
        mapping(uint32 => batchStruct) batch; // batch struct is defined in PoolActionFacet section
    }

    // storage variables
    mapping(address => mapping(address => bytes32)) internal poolIdMapping;
    mapping(bytes32 => poolStateStruct) internal poolState;
    uint32 internal constant harvestInterval = 7 days;
    uint32 internal constant epochTime = 30 seconds;
    uint32 internal constant feeBitShifts = 8; // 1/256 ~ 0.4%

    // functions
    function _getPoolId(
        address tokenX,
        address tokenY
    ) internal view returns (bytes32) {
        return
            tokenX < tokenY
                ? poolIdMapping[tokenX][tokenY]
                : poolIdMapping[tokenY][tokenX];
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                 Order & Pool Action Facet                  */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    // errors
    error PoolNotFound();
    error EpochNotEnded();
    error OrderAlreadyClaimed();
    error NotValidSettlementStep();
    error BatchIsInSettlement();

    // events
    event liquidityRemoved(bytes32 poolId, uint32 epoch);
    event orderSubmitted(bytes32 poolId, uint32 epoch);
    event batchSettled(bytes32 poolId, uint32 epoch);
    event orderClaimed(bytes32 poolId, uint32 epoch, address claimer);

    // modifiers
    modifier onlyValidPool(bytes32 poolId) {
        if (poolState[poolId].tokenX == address(0)) revert PoolNotFound();
        _;
    }

    // structs
    struct unpackedOrderStruct {
        euint32 amountX;
        euint32 amountY;
        ebool isSwap;
        ebool isNoiseReferenceX;
        euint32 noiseAmplitude;
    }

    struct batchStruct {
        // mapping of each individual swap & mint order
        mapping(address => orderStruct) order;
        ////////////////////////////////////////////////
        //      state right before the settlement     //
        ////////////////////////////////////////////////
        euint32 reserveX0;
        euint32 reserveY0;
        euint32 swapX;
        euint32 swapY;
        euint32 mintX;
        euint32 mintY;
        euint32 feeX;
        euint32 feeY;
        ////////////////////////////////////////////////
        //   intermidiate values used in settlement   //
        ////////////////////////////////////////////////
        euint32 XForPricing;
        euint32 YForPricing;
        ////////////////////////////////////////////////
        //      state right after the settlement     //
        ////////////////////////////////////////////////
        euint32 reserveX1;
        euint32 reserveY1;
        euint32 outX;
        euint32 outY;
        euint32 lpIncrement;
    }

    struct orderStruct {
        euint32 swapX;
        euint32 swapY;
        euint32 mintX;
        euint32 mintY;
        bool claimed;
    }
    struct unclaimedOrderStruct {
        bytes32 poolId;
        uint32 epoch;
    }

    // storage variables
    bool internal activateNoiseOrder = false;
    // functions

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                        Viewer Facet                        */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    struct unclaimedOrderForViewerStruct {
        bytes32 poolId;
        uint32 orderEpoch;
        uint32 poolEpoch;
        uint32 lastSettlement;
    }
}

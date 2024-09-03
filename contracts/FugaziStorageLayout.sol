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

    // modifiers

    // structs
    struct accountStruct {
        mapping(bytes32 => euint32) balanceOf; // token (or LP) address => balance
    }

    // storage variables
    mapping(address => accountStruct) internal account;

    // functions
    function _address2bytes32(address addr) internal pure returns (bytes32) {
        return bytes32(bytes20(uint160(addr))) >> 96;
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                    Pool Registry Facet                     */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    // errors
    error InvalidTokenOrder();
    error PoolAlreadyExists();

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
        // protocol account
        euint32 protocolX;
        euint32 protocolY;
        // pool reserves
        euint32 reserveX;
        euint32 reserveY;
        // total supply of LP tokens
        euint32 lpTotalSupply;
        // information of each batch
        // TBD
    }

    // storage variables
    mapping(address => mapping(address => bytes32)) internal poolIdMapping;
    mapping(bytes32 => poolStateStruct) internal poolState;
    uint32 internal constant epochTime = 30 seconds;
    uint32 internal constant feeBitShifts = 10; // 1/1024 ~ 0.1%

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
}

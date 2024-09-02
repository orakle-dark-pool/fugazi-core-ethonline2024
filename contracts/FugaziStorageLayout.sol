// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@fhenixprotocol/contracts/FHE.sol";
import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";

/// This contract will be used to store all the storage variables
/// and will be inherited by all of the other contracts
/// every library should be imported here
contract FugaziStorageLayout is Permissioned {
    // import FHE library
    using FHE for euint32;

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                           Diamond                          */
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

    // amount is not emitted because it is encrypted
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

    // auxiliary function for conversion from address to bytes32
    function address2bytes32(address addr) internal pure returns (bytes32) {
        return bytes32(bytes20(uint160(addr))) >> 96;
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "./RulesEngineIntegration.sol";

/**
 * An example contract that does nothing.
 * This contract is used to demonstrate the use of the `transfer` function.
 */

contract ExampleContract is RulesEngineClientCustom {
    function transfer(address to, uint256 value) public {
        // this function is purposefully empty
    }
}

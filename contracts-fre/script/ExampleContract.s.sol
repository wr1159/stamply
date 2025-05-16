// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "../lib/forge-std/src/Script.sol";
import {ExampleContract} from "../src/ExampleContract.sol";

contract ExampleUserScript is Script {
    ExampleContract public example;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        example = new ExampleContract();

        vm.stopBroadcast();
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "../lib/forge-std/src/Script.sol";
import {StamplyRegistry} from "../src/StamplyRegistry.sol";

contract StamplyRegistryScript is Script {
    StamplyRegistry public stamplyRegistry;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        stamplyRegistry = new StamplyRegistry(
            0x12Ede541Bcf2BaA4b8865378fF4ceb3C8e39970b
        );

        vm.stopBroadcast();
    }
}

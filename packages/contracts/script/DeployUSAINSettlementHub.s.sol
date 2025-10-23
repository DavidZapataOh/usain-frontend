// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {USAINSettlementHub} from "../src/USAINSettlementHub.sol";

contract DeployUSAINSettlementHub is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying USAINSettlementHub...");
        console.log("Deployer address:", deployer);
        console.log("Deployer balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        USAINSettlementHub settlementHub = new USAINSettlementHub();
        
        vm.stopBroadcast();
        
        console.log("USAINSettlementHub deployed to:", address(settlementHub));
        console.log("Owner:", settlementHub.owner());
        
        // Save deployment info
        vm.writeFile(
            "deployments.json",
            string(
                abi.encodePacked(
                    '{"address":"',
                    vm.toString(address(settlementHub)),
                    '","chainId":',
                    vm.toString(block.chainid),
                    ',"blockNumber":',
                    vm.toString(block.number),
                    ',"timestamp":',
                    vm.toString(block.timestamp),
                    '}'
                )
            )
        );
    }
}


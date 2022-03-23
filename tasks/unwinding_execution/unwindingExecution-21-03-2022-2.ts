import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import { Unwinder } from "../../typechain";

task("unwind", "Unwind entries from previous vote")
    .setAction(async function (taskArgs, hre) {
        const network = hre.network.name;
        console.log("Network:", network);

        const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
        const dai = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
        const frax = "0x853d955aCEf822Db058eb8505911ED77F175b99e";
        const usdt = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
        const crv3 = "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490";
        const voteExecutor = "0x85adEF77325af70AC8922195fB6010ce5641d739";
        const gnosis = "0x1F020A4943EB57cd3b2213A66b355CB662Ea43C3";

        const exec = await hre.ethers.getContractAt("Unwinder", "0x0ccC76540E087b2E7567F7BFf80d7EEA0d4F00aC") as Unwinder;

        // Convert all mim reward to usdc so we can compound
        let entries = [
            {
                weight: 17,
                entryToken: usdc,
                curvePool: "0x5a6A4D54456819380173272A5E8E9B9904BdF41B",
                poolToken: crv3,
                poolSize: 2,
                tokenIndexInCurve: 1,
                convexPoolAddress: "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
                convexPoold: 40
            }
        ];

        let unwindPercent = 1;
        let outputCoin = usdc
        let receiver = voteExecutor;
        let swapRewards = true;

        await exec.unwindAny(entries, unwindPercent, outputCoin, receiver, swapRewards);

        console.log('Unwinding task Done!');
    });

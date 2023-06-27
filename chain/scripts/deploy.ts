import { ethers } from "hardhat";

async function main() {
  const ArbitratorContract = await ethers.getContractFactory("Arbitrator");
  const arbitrator = await ArbitratorContract.deploy({value: ethers.utils.parseEther("10.0")}); 
  console.log("Arbitrator deployed to:", arbitrator.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter"; 

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  gasReporter: {
    enabled: false,
    // outputFile: "report-gas.txt",
    // noColors: true,
  }
};

export default config;

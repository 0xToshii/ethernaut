import dotenv from "dotenv";
dotenv.config({path:'../.env'}); // load env vars from .env
import { task, HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "./tasks/index";

const RINKEBY_RPC_URL = 'https://eth-rinkeby.alchemyapi.io/v2/' + process.env.RINKEBY_RPC_KEY;

const accounts = {
  // derive accounts from mnemonic, see tasks/create-key
  mnemonic: "APPLE APPLE APPLE APPLE APPLE APPLE APPLE APPLE APPLE APPLE APPLE APPLE",
};

// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      // old ethernaut compilers
      { version: "0.5.0" },
      { version: "0.6.0" },
      { version: "0.7.3" },
      { version: "0.8.0" }
    ],
  },
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts,
    },
    hardhat: {
      accounts,
      forking: {
        url: RINKEBY_RPC_URL,
        blockNumber: 7838325,
      },
    },
  },
  mocha: {
    timeout: 300 * 1e3,
  }
};

export default config;
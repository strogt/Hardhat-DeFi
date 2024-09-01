require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")  // 部署引用
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()


const MAINNET_RPC_URL =
    process.env.MAINNET_RPC_URL ||
    process.env.ALCHEMY_MAINNET_RPC_URL ||
    "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const SEPOLIA_RPC_URL =
    process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY"
const POLYGON_MAINNET_RPC_URL =
    process.env.POLYGON_MAINNET_RPC_URL || "https://polygon-mainnet.alchemyapi.io/v2/your-api-key"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x"

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Your etherscan API key"
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "Your polygonscan API key"
const REPORT_GAS = process.env.REPORT_GAS || false


module.exports = {
  solidity: {
    compilers: [
        {
            version: "0.8.8",
        },
        {
            version: "0.6.12",
        },
        {
            version: "0.4.19",
        },
        {
          version: "0.6.12",
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
        chainId: 31337,
        // blockConfirmations: 1,
        forking:{
          url: MAINNET_RPC_URL
        }
    },
    localhost: {
        chainId: 31337,
        blockConfirmations: 1,
    },
    sepolia: {
        url: SEPOLIA_RPC_URL,
        accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        //   accounts: {
        //     mnemonic: MNEMONIC,
        //   },
        saveDeployments: true,
        chainId: 11155111,
        blockConfirmations: 6,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
    // customChains: [], // uncomment this line if you are getting a TypeError: customChains is not iterable
  },
  namedAccounts: {
    deployer: {
        default: 0, 
        1: 0, 
    },
    player: {
        default: 1,
    },
  },
  gasReporter: {
    // enabled: REPORT_GAS,
    enabled: false,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  mocha:{
    timeOut: 300000,
  }
};

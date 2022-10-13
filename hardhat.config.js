require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

const MUMBAI_RPC_URL = process.env.MUMBAI_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const GOERLI_RPC_URL = process.env.GOERLI_KEY
const ETHEREUM_RPC_URL = process.env.ETH_KEY
const ETHERSCAN = process.env.ETHERSCAN_KEY

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        mumbai: {
            chainId: 80001,
            blockConfirmations: 1,
            url: MUMBAI_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
        goerli: {
            chainId: 5,
            blockConfirmations: 2,
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
        localhost: {
            chainId: 31337,
        },
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: false,
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    solidity: "0.8.9",
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    mocha: {
        timeout: 300000,
    },
    etherscan: {
        // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: ETHERSCAN,

        // rinkeby: ETHERSCAN_API_KEY,
        // kovan: ETHERSCAN_API_KEY,
        // polygonMumbai: POLYGONSCAN_API_KEY,
    },
}

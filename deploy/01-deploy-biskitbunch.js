const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeNFTs } = require("../utils/uploadToNftStorage")

const imagesLocation = "./images"
let tokenUris

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (process.env.UPLOAD_TO_NFT_STORAGE == "true") {
        tokenUris = await handleTokenUris()
    } else {
        tokenUris = [
            "ipfs://bafyreig3ybezyr5fx7ldiunrqik5h2geonrnr3cjbyeolgidzlnbxjmj6i/metadata.json",
            "ipfs://bafyreia6u2xdzlvrznebrddv7gi7h2ref3zbmlih2rqmihfmikviljeptq/metadata.json",
        ]
    }

    const args = [tokenUris]

    const biskit = await deploy("BiskitBunch", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_KEY) {
        log("Verifying....")
        await verify(biskit.address, args)
    }
    log("------------------------------------------")
}

async function handleTokenUris() {
    const NftUploadResponses = await storeNFTs(imagesLocation)
    const tokenUris = NftUploadResponses.map(({ url }) => url)
    return tokenUris
}

module.exports.tags = ["all", "biskitBunch", "main"]

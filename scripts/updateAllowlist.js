const { deployments, ethers, network } = require("hardhat")

const API_KEY = process.env.GOERLI_API
const PRIVATE_KEY = process.env.PRIVATE_KEY
const CONTRACT = process.env.CONTRACT

const contract = require("../artifacts/contracts/BiskitBunch.sol/BiskitBunch.json")
const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY)
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider)
const biskit = new ethers.Contract(CONTRACT, contract.abi, signer)

async function main() {
    const tx = await biskit.allowlistAddress(["0x532B8A5646759b0E4B87C2825412CBe072402Bd5"])
    await tx.wait()

    const mint = await biskit.mint(1)
    await mint.wait()
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})

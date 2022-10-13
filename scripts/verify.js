const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
        console.log("Verified!!!")
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }
}

uri = [
    "ipfs://bafyreig3ybezyr5fx7ldiunrqik5h2geonrnr3cjbyeolgidzlnbxjmj6i/metadata.json",
    "ipfs://bafyreia6u2xdzlvrznebrddv7gi7h2ref3zbmlih2rqmihfmikviljeptq/metadata.json",
]
args = [uri]
address = "0xA2C7D192708EA188E725E9A8684Dc9f29BC10F45"

verify(address, args)

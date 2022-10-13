// Import the NFTStorage class and File constructor from the 'nft.storage' package
const { NFTStorage, File } = require("nft.storage")
const mime = require("mime")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_API_KEY

/**
 * Reads an image file from `imagePath` and stores an NFT with the given name and description.
 * @param {string} imagePath the path to an image file
 * @param {string} name a name for the NFT
 * @param {string} description a text description for the NFT
 */
async function storeNFTs(imagesPath) {
    const fullImagesPath = path.resolve(imagesPath)
    const files = fs.readdirSync(fullImagesPath)
    let responses = []
    for (fileIndex in files) {
        const image = await fileFromPath(`${fullImagesPath}/${files[fileIndex]}`)
        const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })
        const biskitName = files[fileIndex].replace(".png", "")
        let _description
        if (biskitName == "Mr.Biskit"){
            _description = "The Creator of the BiskitBunch. The crunchy and choc-chip filled founder, who's passion and love for Web3 is unparalleled to all the cookies on the globe."
        } else {
            _description = "An admirable captain in the BiskitBunch. A dedicated creative pushing the adoption of Web3 in developing and contributing to extraordinary projects."
        }
        const response = await nftstorage.store({
            image,
            name: biskitName,
            description: _description,
        })
        responses.push(response)
    }
    return responses
}

/**
 * A helper to read a file from a location on disk and return a File object.
 * @param {string} filePath the path to a file to store
 * @returns {File} a File object containing the file content
 */
async function fileFromPath(filePath) {
    const content = await fs.promises.readFile(filePath)
    const type = mime.getType(filePath)
    return new File([content], path.basename(filePath), { type })
}

module.exports = {
    storeNFTs,
}

const { inputToConfig } = require("@ethereum-waffle/compiler")
const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("BiskitBunch NFT Unit Tests", function () {
          let biskit, deployer, account1
          const chainId = network.config.chainId
          const tokenUri = [
              "ipfs://bafyreig3ybezyr5fx7ldiunrqik5h2geonrnr3cjbyeolgidzlnbxjmj6i/metadata.json",
              "ipfs://bafyreia6u2xdzlvrznebrddv7gi7h2ref3zbmlih2rqmihfmikviljeptq/metadata.json",
          ]

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              biskit = await ethers.getContract("BiskitBunch", deployer)
          })

          describe("Constructor", function () {
              it("Should initialize the NFT correctly", async function () {
                  const theTokenUri = await biskit.getTokenUri()
                  expect(theTokenUri).to.have.deep.members(tokenUri)
              })
          })

          describe("Allowlist", function () {
              it("Should allow only the owner to update Allowlist Array", async function () {
                  const account = await ethers.getSigners()
                  const alienAccount = await biskit.connect(account[1])
                  await expect(alienAccount.allowlistAddress([account[1]].address)).to.be.reverted
              })
          })
          describe("Mint", function () {
              it("Should allow the owner to Mint the NFT", async function () {
                  const account = await ethers.getSigners()
                  const owner = await biskit.connect(account[0])
                  await owner.allowlistAddress(["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"])
                  const tx = await owner.mint(1)
                  tx.wait()
                  const ownerOf = await owner.ownerOf(1)
                  await assert.equal(ownerOf, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
              })
              it("Should not allow address that is not on allowlist to mint", async function () {
                  const account = await ethers.getSigners()
                  const alien = await biskit.connect(account[1])
                  await expect(alien.mint(1)).to.be.revertedWith("Address not on allowlist")
              })
          })
      })

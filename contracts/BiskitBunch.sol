//SPDX-Licence-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

error InvalidMintAmount();

pragma solidity ^0.8.9;

contract BiskitBunch is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    /**
     * NFT Variables
     */
    string[] internal s_biskitUri;
    uint256 private constant TOTAL_SUPPLY = 500;
    uint256 public constant MAX_PER_MINT = 1;
    Counters.Counter private tokenIds;

    /**
     * Allowlist Mappings
     */
    mapping(address => bool) public isAllowlistAddress;

    /**
     * Events
     */
    event NftMinted(uint256 tokenId, address owner);
    event Allowlistupdate(address indexed listedAddress);

    constructor(string[2] memory biskitUri) ERC721("BiskitBunch", "BBU") {
        s_biskitUri = biskitUri;
    }

    /**
     * Minting Functionality
     */
    modifier mintCompliance(uint256 _mintAmount) {
        require(_mintAmount > 0 && _mintAmount <= MAX_PER_MINT, "Invalid Mint Amount");
        require(tokenIds.current() + _mintAmount <= TOTAL_SUPPLY, "Total supply exceeded!");
        require(isAllowlistAddress[msg.sender], "Address not on allowlist");
        _;
    }

    function mint(uint256 mintAmount) public mintCompliance(mintAmount) {
        if (mintAmount == 0) {
            revert InvalidMintAmount();
        }
        tokenIds.increment();
        uint256 tokenId = tokenIds.current();
        string memory tokenUri;
        if (tokenId == 1) {
            tokenUri = s_biskitUri[1];
        } else {
            tokenUri = s_biskitUri[0];
        }
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenUri);
        isAllowlistAddress[msg.sender] = false;
    }

    /**
     * Allowlist Management
     */

    function allowlistAddress(address[] calldata wAddresses) public onlyOwner {
        for (uint256 i = 0; i < wAddresses.length; ) {
            isAllowlistAddress[wAddresses[i]] = true;
            unchecked {
                i++;
            }
        }
    }

    /**
     * Token Metadata
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * Testing getter functions
     */
    function getTokenUri() public view returns (string[] memory tokenUri) {
        return s_biskitUri;
    }

    function getAllowStatus(address allowAddress) public view returns (bool) {
        return isAllowlistAddress[allowAddress];
    }
}

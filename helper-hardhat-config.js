const networkConfig = {
    31337: {
        name: "localhost",
        wethToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",  // WETH主网合约地址
        lendingPoolAddressesProvider: "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5", // aave池子地址
        daiEthPriceFeed: "0x773616E4d11A78F511299002da57A0a94577F1f4",
        daiToken: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    // Price Feed Address, values can be obtained at https://docs.chain.link/data-feeds/price-feeds/addresses
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}

const { ethers, getNamedAccounts, network } = require("hardhat")
const { getWeth,AMOUNT } = require("./getWeth")
const { networkConfig } = require("../helper-hardhat-config")

const main =async ()=>{
    await getWeth()
    const { deployer } =await getNamedAccounts() 
    // https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts  LendingPoolAddressesProvider
    // 借贷池开发地址：0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
    // 获得借贷池子：当前地址是以太坊主网地址（主网分叉交互）
    const lendingPool = await getLendPool(deployer)
    console.log(`借贷池地址：${lendingPool.address}`)

    // deposit
    await approveErc20(networkConfig[network.config.chainId].wethToken,lendingPool.address,AMOUNT,deployer)
    console.log("depositing...")
    await lendingPool.deposit(networkConfig[network.config.chainId].wethToken,AMOUNT,deployer,0)
    console.log("depositde!")

    // Borrow
    let { availableBorrowsETH, totalDebtETH } =await getBorrowUserData(lendingPool,deployer)
    const daiPrice =await getDaiPrice()
    const amountDaiToBorrow = availableBorrowsETH.toString() * 0.95 *( 1/daiPrice.toString())
    console.log(`you can borrow ${amountDaiToBorrow} Dai`);
    const amountDaiToBorrowWei = ethers.utils.parseEther(amountDaiToBorrow.toString())
    await borrowDai(networkConfig[network.config.chainId].daiToken,lendingPool,amountDaiToBorrowWei,deployer)
    // 对比再次借款信息对比
    await getBorrowUserData(lendingPool,deployer)

    // 偿还
    await repay(amountDaiToBorrowWei,networkConfig[network.config.chainId].daiToken,lendingPool,deployer)
    // 对比偿还借款信息对比
    await getBorrowUserData(lendingPool,deployer)
}

// 偿还
const repay =async (
    amount,
    daiAddress,
    lendingPool,
    account
)=>{
    // 类似把ERC20授权偿还
    await approveErc20(daiAddress,lendingPool.address,amount,account)
    const repayTx =await lendingPool.repay(
        daiAddress,
        amount,
        2,
        account
    )
    await repayTx.wait(1)
    console.log("You've repayed!");
    
}

// 以Dai为借款单位换算
const borrowDai = async (
    daiAddress,
    lendingPool,
    amountDaiToBorrowWei,
    account
) => {
    const borrowTx = await lendingPool.borrow(
        daiAddress,
        amountDaiToBorrowWei,
        2, // 1/2
        0,
        account
    )
    await borrowTx.wait(1)
    console.log("You've borrowed!");
}

// 获取DAI的价格
const getDaiPrice = async ()=>{
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        networkConfig[network.config.chainId].daiEthPriceFeed
    )
    const price = (await daiEthPriceFeed.latestRoundData())[1]
    console.log(`The DAI/ETH price is ${price.toString()}`);
    return price
}

// 获取借钱用户数据
const getBorrowUserData =async (lendingPool,account)=>{
    // 获取债务和抵押品和可借金额
    const {
        totalCollateralETH,
        totalDebtETH,
        availableBorrowsETH
    } = await lendingPool.getUserAccountData(account)
    console.log(`You have ${totalCollateralETH} worth of ETH deposited.`)
    console.log(`You have ${totalDebtETH} worth of ETH borrowed.`)
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH.`)
    return { availableBorrowsETH, totalDebtETH }
}

// 获取aave池子
const getLendPool =async (account)=>{
    // ILendingPoolAddressesProvider可以从依赖中获取，也可以从npm引用
    const lendingPoolAddressesProvider =await ethers.getContractAt(
        'ILendingPoolAddressesProvider',
        networkConfig[network.config.chainId].lendingPoolAddressesProvider,
        account
    )

    const lendingPoolAddres =await lendingPoolAddressesProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt(
        "ILendingPool",
        lendingPoolAddres,
        account
    )
    return lendingPool
}

// 获得授权
const approveErc20 = async (erc20Address, spenderAddress, amountToSpender, account)=>{
    const erc20Token = await ethers.getContractAt(
        "IERC20",
        erc20Address,
        account
    )
    const tx = await erc20Token.approve(spenderAddress,amountToSpender)
    await tx.wait(1)
    console.log("Approved!")
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
const { getNamedAccounts, ethers, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

const AMOUNT = ethers.utils.parseEther("0.01")
const getWeth =async ()=>{
    const {deployer} =await getNamedAccounts()
    console.log(deployer)
    // 调用存款合约
    // need: abi , contract address
    // weth 从主网地址获取: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    const iWeth =await ethers.getContractAt("IWeth",networkConfig[network.config.chainId].wethToken,deployer)
    
    const tx = await iWeth.deposit({value: AMOUNT})
    await tx.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer)
    console.log( `Got ${wethBalance.toString()} WETH`);
    
}

module.exports = { getWeth,AMOUNT }
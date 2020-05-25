
import {
    liquidationCall,
    getLendingPoolAddress
} from '../contracts/contractInstances'

import ERC20ABI from '../../abi/ERC20ABI.json'
import { approveErc20 } from '../contracts/contractCalls';


export const liquidate = async (collateral, reserve, user, purchaseAmount, receiveAToken) => {

    //Gets the Lending pool provider contract
    const lpAddressProviderContract = new
        web3.eth.Contract(
            LendingPoolAddressesProviderABI,
            lpAddressProviderAddress
        );

    //Get the lending pool address
    const lpAddress = await getLendingPoolAddress(lpAddressProviderContract)

    //Get the lending pool core address
    const lpCoreAddress = await getLpCoreAddress(lpAddressProviderContract)

    //Create the lending pool contract
    const lpContract = await new web3.eth.Contract(LendingPoolABI, lpAddress)

    //Erc20 contract of the reserve to allow spend tokens to lending pool
    const erc20Contract = new
        web3.eth.Contract(
            ERC20ABI,
            reserve
        );

    //Approves the lending core pool to spend our tokens
    await approveErc20(
        erc20Contract,
        lpCoreAddress,
        purchaseAmount,
        fromAccount,
        reserve)

    //Liquidation call
    await liquidationCall(
        lpContract,
        lpAddress,
        collateral,
        user,
        web3.utils.toWei(purchaseAmount, "ether"),
        reserve,
        receiveAToken)
        .catch((e) => {
            console.log(e)
            throw Error(`Error on liquidation call: ${e.message}`)
        })

}








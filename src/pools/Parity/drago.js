// Copyright 2017 Rigo Investment Sagl.
// This file is part of RigoBlock.

import * as abis from '../../contracts/abi'
import { WETH_ADDRESSES, ZRX_ADDRESSES } from '../../utils/const'
import Registry from '../registry'

class DragoParity {
  constructor(api) {
    if (!api) {
      throw new Error('API instance needs to be provided to Contract')
    }
    this._api = api
    this._abi = abis.drago
    this._registry = new Registry(api)
    this._constunctorName = this.constructor.name
  }

  get instance() {
    if (typeof this._instance === 'undefined') {
      throw new Error('The contract needs to be initialized.')
    }
    return this._instance
  }

  init = address => {
    if (!address) {
      throw new Error('Contract address needs to be provided')
    }
    const api = this._api
    const abi = this._abi
    this._instance = api.newContract(abi, address).instance
    return this._instance
  }

  getData = () => {
    const instance = this._instance
    return instance.getData.call({})
  }

  getAdminData = () => {
    const instance = this._instance
    return instance.getAdminData.call({})
  }

  balanceOf = accountAddress => {
    if (!accountAddress) {
      throw new Error('accountAddress needs to be provided')
    }
    const instance = this._instance
    return instance.balanceOf.call({}, [accountAddress])
  }

  getBalance = () => {
    const api = this._api
    const instance = this._instance
    return api.eth.getBalance(instance.address)
  }

  getBalanceWETH = () => {
    const api = this._api
    const instance = this._instance
    const wethInstance = api.newContract(
      abis.weth,
      WETH_ADDRESSES[api._rb.network.id]
    ).instance
    return wethInstance.balanceOf.call({}, [instance.address])
  }

  getBalanceZRX = () => {
    const api = this._api
    const instance = this._instance
    const tokenInstance = api.newContract(
      abis.weth,
      ZRX_ADDRESSES[api._rb.network.id]
    ).instance
    return tokenInstance.balanceOf.call({}, [instance.address])
  }

  getBalanceToken = tokenAddress => {
    const api = this._api
    const instance = this._instance
    const tokenInstance = api.newContract(abis.erc20, tokenAddress).instance
    return tokenInstance.balanceOf.call({}, [instance.address])
  }

  buyDrago = (accountAddress, amount) => {
    if (!accountAddress) {
      throw new Error('accountAddress needs to be provided')
    }
    if (!amount) {
      throw new Error('amount needs to be provided')
    }
    const instance = this._instance
    const options = {
      from: accountAddress,
      value: amount
    }
    return instance.buyDrago.estimateGas(options, []).then(gasEstimate => {
      options.gas = gasEstimate.times(1.2).toFixed(0)
      console.log(
        `Buy Drago: gas estimated as ${gasEstimate.toFixed(0)} setting to ${
          options.gas
        }`
      )
      return instance.buyDrago.postTransaction(options, [])
      // .then((receipt) => {
      //   return api.parity.checkRequest(receipt, [])
      // })
    })
  }

  cancelOrderCFDExchange = (accountAddress, exchangeAddress, cfd, tradeId) => {
    if (!accountAddress) {
      throw new Error('accountAddress needs to be provided')
    }
    if (!exchangeAddress) {
      throw new Error('exchangeAddress needs to be provided')
    }
    if (!cfd) {
      throw new Error('cfd needs to be provided')
    }
    if (!tradeId) {
      throw new Error('tradeId needs to be provided')
    }
    const instance = this._instance
    const options = {
      from: accountAddress
    }
    const values = [accountAddress, exchangeAddress, cfd, tradeId]
    console.log(exchangeAddress)
    return instance.cancelOrderCFDExchange
      .estimateGas(options, values)
      .then(gasEstimate => {
        console.log(gasEstimate.toFormat())
        options.gas = gasEstimate.times(1.2).toFixed(0)
        return instance.cancelOrderCFDExchange.postTransaction(options, values)
      })
      .catch(error => {
        console.error('error', error)
      })
  }

  depositToExchange = (accountAddress, exchangeAddress, amount) => {
    if (!accountAddress) {
      throw new Error('accountAddress needs to be provided')
    }
    if (!exchangeAddress) {
      throw new Error('exchangeAddress needs to be provided')
    }
    if (!amount) {
      throw new Error('amount needs to be provided')
    }
    const instance = this._instance
    const options = {
      from: accountAddress
    }
    const values = [exchangeAddress, amount]
    console.log(exchangeAddress)
    return instance.depositToExchange
      .estimateGas(options, values)
      .then(gasEstimate => {
        console.log(gasEstimate.toFormat())
        options.gas = gasEstimate.times(1.2).toFixed(0)
        return instance.depositToExchange.postTransaction(options, values)
      })
      .catch(error => {
        console.error('error', error)
      })
  }

  placeOrderCFDExchange = (
    accountAddress,
    exchangeAddress,
    cfd,
    is_stable,
    adjustment,
    stake
  ) => {
    if (!accountAddress) {
      throw new Error('accountAddress needs to be provided')
    }
    if (!exchangeAddress) {
      throw new Error('exchangeAddress needs to be provided')
    }
    if (!cfd) {
      throw new Error('cfd needs to be provided')
    }
    if (!is_stable) {
      throw new Error('is_stable needs to be provided')
    }
    if (!adjustment) {
      throw new Error('adjustment needs to be provided')
    }
    if (!stake) {
      throw new Error('stake needs to be provided')
    }
    const instance = this._instance
    const options = {
      from: accountAddress
    }
    const values = [
      exchangeAddress,
      exchangeAddress,
      cfd,
      is_stable,
      adjustment,
      stake
    ]
    console.log(exchangeAddress)
    return instance.depositToExchange
      .estimateGas(options, values)
      .then(gasEstimate => {
        console.log(gasEstimate.toFormat())
        options.gas = gasEstimate.times(1.2).toFixed(0)
        return instance.depositToExchange.postTransaction(options, values)
      })
      .catch(error => {
        console.error('error', error)
      })
  }

  sellDrago = (accountAddress, amount) => {
    if (!accountAddress) {
      throw new Error('accountAddress needs to be provided')
    }
    if (!amount) {
      throw new Error('amount needs to be provided')
    }
    const instance = this._instance
    const values = [amount]
    const options = {
      from: accountAddress
    }
    return instance.sellDrago.estimateGas(options, values).then(gasEstimate => {
      options.gas = gasEstimate.times(1.2).toFixed(0)
      console.log(
        `Sell Drago: gas estimated as ${gasEstimate.toFixed(0)} setting to ${
          options.gas
        }.`
      )
      return instance.sellDrago.postTransaction(options, values)
    })
  }

  setPrices = (accountAddress, buyPrice, sellPrice) => {
    if (!accountAddress) {
      throw new Error('accountAddress needs to be provided')
    }
    if (!buyPrice) {
      throw new Error('buyPrice needs to be provided')
    }
    if (!sellPrice) {
      throw new Error('sellPrice needs to be provided')
    }
    const api = this._api
    const block = 1
    const hash = api.util.fromAscii('random')
    const data = api.util.fromAscii('random')
    const buyPriceWei = api.util.toWei(buyPrice, 'ether')
    const sellPriceWei = api.util.toWei(sellPrice, 'ether')
    const instance = this._instance
    const values = [sellPriceWei, buyPriceWei, block, hash, data]
    const options = {
      from: accountAddress
    }
    return instance.setPrices.estimateGas(options, values).then(gasEstimate => {
      options.gas = gasEstimate.times(1.2).toFixed(0)
      console.log(
        `setPrices Drago: gas estimated as ${gasEstimate.toFixed(
          0
        )} setting to ${options.gas}. Setting values: ${values}`
      )
      return instance.setPrices.postTransaction(options, values)
    })
  }

  totalSupply = () => {
    const instance = this._instance
    return instance.totalSupply.call({}, [])
  }

  getTokenBalance = tokenAddress => {
    const api = this._api
    const instance = this._instance
    const erc20Instance = api.newContract(abis.erc20, tokenAddress).instance
    return erc20Instance.balanceOf.call({}, [instance.address])
  }

  getAssets = () => {}
}

export default DragoParity

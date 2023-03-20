import { ethers } from "ethers"
import * as admin from "firebase-admin"
import { GasFreeClient } from "../utils/GasFreeClient"
export class Token {
  daoId: string
  constructor(daoId: string) {
    this.daoId = daoId
  }

  async balanceOf(walletAddress: string) {
    const { tokenAddress } = await this._getGasFreeTokenInfo()
    if (!tokenAddress) {
      throw new Error("token address is not found")
    }

    const client = new GasFreeClient()
    const res = await client.balanceOf(tokenAddress, walletAddress)
    return res.amount
  }

  async transfer(to: string, amount: number) {
    // wallet addressの取得
    const { walletAddress, walletPrivateKey, tokenAddress } = await this._getGasFreeTokenInfo()
    if (!walletAddress || !walletPrivateKey) {
      throw new Error("wallet address is not found")
    }
    if (!tokenAddress) {
      throw new Error("token address is not found")
    }

    // 署名を作成
    const signature = await this._sign(walletAddress, walletPrivateKey)

    const client = new GasFreeClient()
    await client.mint(tokenAddress, to, amount, walletAddress, signature)
  }

  private async _getGasFreeTokenInfo() {
    const doc = await admin.firestore().collection("GasFreeToken").doc(this.daoId).get()
    return {
      walletAddress: doc.data()?.walletAddress,
      walletPrivateKey: doc.data()?.walletPrivateKey,
      tokenAddress: doc.data()?.tokenAddress,
    }
  }

  private async _sign(walletAddress: string, walletPrivateKey: string) {
    const wallet = new ethers.Wallet(walletPrivateKey)
    const message = walletAddress
    const signature = await wallet.signMessage(message)
    return signature
  }

  async createToken() {
    // 新規にWalletを作成
    const wallet = ethers.Wallet.createRandom()

    // アドレスと秘密鍵を取得
    const walletAddress = wallet.address
    const walletPrivateKey = wallet.privateKey

    // 署名を作成
    const signature = await this._sign(walletAddress, walletPrivateKey)

    // トークンを作成
    const client = new GasFreeClient()
    const response = await client.create(walletAddress, signature)

    // DBに保存
    admin.firestore().collection("GasFreeToken").doc(this.daoId).set({
      walletAddress,
      walletPrivateKey,
      tokenAddress: response.tokenAddress,
    })
  }
}

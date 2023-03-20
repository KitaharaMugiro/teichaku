import { useRouter } from "next/router"
import { useEffect } from "react"
import { APIClient } from "@/utils/APIClient"
import useWeb3Auth from "@/hooks/web3/useWeb3Auth"
import useMetaMask from "./web3/useMetaMask"

export const useMigrateWeb3 = () => {
  const router = useRouter()
  const { daoId, projectId } = router.query
  const { getUserIdToken } = useWeb3Auth()
  const apiClient = new APIClient()
  const { address, login: loginMetamask } = useMetaMask(true)
  const { login } = useWeb3Auth()

  const migrateDao = async () => {
    const idToken = await getUserIdToken()
    const headers = {
      Authorization: `Bearer ${idToken}`,
    }
    const res = await apiClient.post(
      "/migrateDao",
      {
        daoId: daoId,
      },
      headers
    )
    return res
  }

  const registerWalletAddress = async () => {
    //ログインも必要だしMetamaskも必要
    const idToken = await getUserIdToken()
    if (!idToken) {
      //window.alert("Please login first.")
      await login()
      return
    }
    if (!address) {
      await loginMetamask()
      return
    }

    const headers = {
      Authorization: `Bearer ${idToken}`,
    }
    const res = await apiClient.post(
      "/registerWalletAddress",
      {
        walletAddress: address,
      },
      headers
    )
    return res
  }

  const isRegisterWallet = async () => {
    const idToken = await getUserIdToken()
    if (!idToken) {
      return null
    }
    const headers = {
      Authorization: `Bearer ${idToken}`,
    }
    const res = await apiClient.get("/getWalletAddress", headers)
    if (res === undefined) return null
    return res?.data.walletAddress ? true : false
  }

  return {
    migrateDao,
    registerWalletAddress,
    isRegisterWallet,
  }
}

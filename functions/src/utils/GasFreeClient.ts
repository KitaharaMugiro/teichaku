import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios"

export class GasFreeClient {
  static baseUrl = "https://us-central-gas-free-token.cloudfunctions.net"

  public async create(walletAddress: string, signature: string) {
    const options: AxiosRequestConfig = {
      baseURL: GasFreeClient.baseUrl,
      url: "/create",
      method: "post",
      data: {
        walletAddress,
        signature,
      },
    }
    const res: AxiosResponse | void = await axios(options).catch((e: AxiosError<{ error: string }>) => {
      console.error(e.message)
    })

    return res?.data as { tokenAddress: string }
  }

  public async mint(tokenAddress: string, to: string, amount: number, walletAddress: string, signature: string) {
    const options: AxiosRequestConfig = {
      baseURL: GasFreeClient.baseUrl,
      url: "/mint",
      method: "post",
      data: {
        tokenAddress,
        to,
        amount,
        walletAddress,
        signature,
      },
    }
    const res: AxiosResponse | void = await axios(options).catch((e: AxiosError<{ error: string }>) => {
      console.error(e.message)
    })
    return res?.data as { message: string }
  }

  public async balanceOf(tokenAddress: string, walletAddress: string) {
    const options: AxiosRequestConfig = {
      baseURL: GasFreeClient.baseUrl,
      url: "/balanceOf",
      method: "get",
      data: {
        tokenAddress,
        walletAddress,
      },
    }
    const res: AxiosResponse | void = await axios(options).catch((e: AxiosError<{ error: string }>) => {
      console.error(e.message)
    })
    return res?.data as { amount: number }
  }
}

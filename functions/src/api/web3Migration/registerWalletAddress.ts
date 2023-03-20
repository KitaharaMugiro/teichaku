import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import { getUserAddress } from "../../utils/decodeJwt"

export const registerWalletAddress = functions.region("asia-northeast1").https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*")

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET")
    res.set("Access-Control-Allow-Headers", "Authorization, Content-Type")
    res.set("Access-Control-Max-Age", "3600")
    res.status(204).send("")
  } else {
    type RequestData = { walletAddress: string }
    const userId = getUserAddress(req.headers.authorization || "") || ""
    if (!userId) {
      res.status(400).send({ message: "Authorization Error" })
      return
    }

    const requestData: RequestData = req.body
    await admin.firestore().collection("wallet").doc(userId).set({
      walletAddress: requestData.walletAddress,
    })

    res.status(200).send({
      message: "success",
    })
  }
})

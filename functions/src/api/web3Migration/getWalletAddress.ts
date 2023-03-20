import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import { getUserAddress } from "../../utils/decodeJwt"

export const getWalletAddress = functions.region("asia-northeast1").https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*")

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET")
    res.set("Access-Control-Allow-Headers", "Authorization, Content-Type")
    res.set("Access-Control-Max-Age", "3600")
    res.status(204).send("")
  } else {
    const userId = getUserAddress(req.headers.authorization || "") || ""
    if (!userId) {
      res.status(400).send({ message: "Authorization Error" })
      return
    }

    const walletAddress = await admin
      .firestore()
      .collection("wallet")
      .doc(userId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data()?.walletAddress
        } else {
          return ""
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error)
        return ""
      })

    if (!walletAddress) {
      res.status(400).send({ message: "not found" })
      return
    }

    res.status(200).send({
      walletAddress,
    })
  }
})

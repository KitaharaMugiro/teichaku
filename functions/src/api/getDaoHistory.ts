import * as functions from "firebase-functions"
import { DAOHistory } from "../contracts/DAOHistory"
<<<<<<< HEAD
import { DAOHistoryItem, DAOHistoryItemWithDate } from "../struct/dao/DAOHistoryItem"
import { getUserAddress } from "../utils/decodeJwt"
=======
import { DAOHistoryItem } from "../struct/dao/DAOHistoryItem"
>>>>>>> 0cd66ae483c36ce5fff0f6aa42122019afd57beb

export const getDaoHistory = functions.region("asia-northeast1").https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*")

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET")
    res.set("Access-Control-Allow-Headers", "Authorization, Content-Type")
    res.set("Access-Control-Max-Age", "3600")
    res.status(204).send("")
  } else {
    const userId = getUserAddress(req.headers.authorization || "")
    const sender = userId || ""
    const requestData: { daoId: string; projectId: string } = req.body
    const daoHistory = new DAOHistory("", sender)
    const response: DAOHistoryItem[] = await daoHistory.getDaoHistory(requestData.daoId, requestData.projectId)
    res.status(200).send(response)
  }
})

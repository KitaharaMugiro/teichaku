import * as functions from "firebase-functions"
import { Poll } from "../class/Poll"

export const vote = functions.region("asia-northeast1").https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*")

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET")
    res.set("Access-Control-Allow-Headers", "Content-Type")
    res.set("Access-Control-Max-Age", "3600")
    res.status(204).send("")
  } else {
    const requestData = req.body
    const poll = new Poll(requestData.daoId, requestData.projectId)
    await poll.vote(requestData.pollId, requestData.candidates, requestData.points, requestData.comments)
    res.status(200).send({ message: "success" })
  }
})
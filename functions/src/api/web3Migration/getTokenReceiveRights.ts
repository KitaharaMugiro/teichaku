import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const candidateToCurrentPoll = functions.region("asia-northeast1").https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    type RequestData = {daoId:string}
    const userId = "test" //TODO: HeaderのJWTから取得する
    const requestData: RequestData  = req.body ;
    const migrationUserData = await admin.firestore()
    .collection("migration")
    .doc(requestData.daoId + "/" + userId).get();
    const isExist = migrationUserData.exists
    const migrationUser = migrationUserData.data()
    if(!isExist || !migrationUser){
        res.status(400).send({ message: "not found" });
        return;
    }
    //すでにウォレットアドレスが登録されていれば受け取り済み
    if(migrationUser.walletAddress){
        res.status(400).send({ message: "already received" });
        return;
    }
    res.status(200).send({ 
        token: migrationUser.token,
     });
  }
});
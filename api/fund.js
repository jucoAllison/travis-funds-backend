const express = require("express")
const funds = express.Router()
const fundsController = require("../controller/fund")
const checkID = require("../checkID")
const checkAuth = require("../checkAuth")


funds.post("/fund_my_account/:ID", checkID, checkAuth, fundsController.fundMyAccount)
funds.get("/get_fund_history/:ID", checkID, checkAuth, fundsController.get_fund_history)
funds.get("/get/user_main/history/:ID", fundsController.get_fund_history)

// admin
funds.get("/approve_this_fund/:fundID/:which", fundsController.approveFund)

// user tranferring funds to user
funds.post("/:ID/send_funds", checkID, checkAuth, fundsController.sendFundsToAnyUser)

module.exports = funds
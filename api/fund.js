const express = require("express")
const funds = express.Router()
const fundsController = require("../controller/fund")
const checkID = require("../checkID")
const checkAuth = require("../checkAuth")


funds.post("/fund_my_account/:ID", checkID, checkAuth, fundsController.fundMyAccount)
funds.get("/get_fund_history/:ID", checkID, checkAuth, fundsController.get_fund_history)

// admin
funds.get("/approve_this_fund/:fundID/:which", fundsController.approveFund)

module.exports = funds
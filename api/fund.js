const express = require("express")
const funds = express.Router()
const fundsController = require("../controller/fund")
const checkID = require("../checkID")
const checkAuth = require("../checkAuth")


funds.post("/fund_my_account/:ID", checkID, fundsController.fundMyAccount)


module.exports = funds
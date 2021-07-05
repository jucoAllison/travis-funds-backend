const express = require("express")
const deposit = express.Router()
const depositController = require("../controller/depositController")
const checkID = require("../checkID")
const checkAuth = require("../checkAuth")


deposit.post("/new_deposit_for_user", checkAuth, depositController.postNewDepositForUser)


module.exports = deposit
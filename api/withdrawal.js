const express = require("express")
const withdrawal = express.Router()
const withdrawalController = require("../controller/withdrawalController")
const checkID = require("../checkID")
const checkAuth = require("../checkAuth")


//user creating withdrawal request
withdrawal.post("/newWithdrawal/:ID", checkAuth, withdrawalController.post_new_withdrawal)


//getting all withdrawal for each deposit
withdrawal.get("/getWithdrawal/:ID", checkAuth, withdrawalController.getEach)

module.exports = withdrawal
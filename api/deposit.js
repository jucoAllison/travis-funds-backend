const express = require("express")
const deposit = express.Router()
const depositController = require("../controller/depositController")
const checkID = require("../checkID")
const checkAuth = require("../checkAuth")

//user depositing or  making any investment this is just investment route
deposit.post("/new_deposit_for_user", checkAuth, depositController.postNewDepositForUser)

//user getting the investment or deposits, deposited
deposit.get("/getAllInvestments", checkAuth, depositController.getAllInvestments)
//use getting each investment full details
deposit.get("/getEachInvestment/:ID", checkAuth, depositController.getEachDepositInvestment)

// //user creating withdrawal request
// deposit.get("/getEachInvestment/:ID", checkAuth, depositController.getEachDepositInvestment)

module.exports = deposit
const express = require("express")
const adminSide = express.Router()
const checkID = require("../checkID")
const adminSideController = require("../controller/adminSideController")

// getting all user
adminSide.get("/get/all/users", adminSideController.getAllUserForFX);
// getting all each user
adminSide.get("/get/each/user/:ID", adminSideController.getEachUserForFX);
// updating each user details
adminSide.put("/put/activity/user/:ID", adminSideController.updateUser)
// deleting each user
adminSide.delete("/delete/user/:ID", adminSideController.deleteUser)
// togging process of every fund, deposit and withdrawal
adminSide.put("/put/transaction/:ID", adminSideController.processTransaction)
// togging cancle of every fund, deposit and withdrawal
adminSide.put("/put/transaction/cancle/:ID", adminSideController.cancleTransaction)
// togging cancle of every fund, deposit and withdrawal
adminSide.delete("/delete/transaction/:ID", adminSideController.deleteTransaction)

// admin getting list of all funds and user details of users that fund there account
adminSide.get("/get/account/fundDetails", adminSideController.getAllFundsAndDetails)

// admin getting each transaction details whether fund or deposit or whedrawal
adminSide.get("/get/account/transaction/:ID/:name", adminSideController.getTransaction)


module.exports = adminSide
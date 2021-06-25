const express = require("express")
const settings = express.Router()
const settingsController = require("../controller/settingsController")
const checkID = require("../checkID")
const checkAuth = require("../checkAuth")


// changing password
settings.put("/password", checkAuth, settingsController.changePassword)

// changing account details 
settings.put("/bank-details", checkAuth, settingsController.changeBank)

// enabling account transfer 
settings.put("/account-transfer", checkAuth, settingsController.accountTransfer)

module.exports = settings
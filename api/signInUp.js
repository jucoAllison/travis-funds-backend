const express = require("express")
const sign = express.Router()

const signInUpController = require("../controller/signInUpController")
// const helper = require("../helper")
const checkID = require("../checkID")


// CreateAccount or signUP
sign.post("/signup", signInUpController.signUP)

// login or signIN
sign.post("/signin", signInUpController.signIN)

// updateing userInfo imediately after signUP
sign.put("/updateDetails/:ID", checkID, signInUpController.updateProfile)

// user activating email from the email sent to the user
sign.get("/activate-account/:random/:name/:username/:ID/:another", checkID, signInUpController.activeEmail)

// admin getting all users
sign.get("/allusers", signInUpController.getAllUsers)

// admin deleting any users
sign.delete("/delete-user/:ID", checkID, signInUpController.deleteUser)

module.exports = sign
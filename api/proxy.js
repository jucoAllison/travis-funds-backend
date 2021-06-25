const express = require("express")
const proxy = express.Router()
const proxyController = require("../controller/proxyController")
const checkAuth = require("../checkAuth")


// changing password
proxy.post("/getGraph", checkAuth, proxyController.getGraph)


// first fetching from etoro website
proxy.get("/getGraphFirstDetails", checkAuth, proxyController.firstFetching)


// second fetching from etoro website
proxy.get("/getGraphSecondDetails", checkAuth, proxyController.secondFetching)

// third fetching from etoro website
proxy.get("/getGraphThirdDetails", checkAuth, proxyController.thirdFetching)

module.exports = proxy
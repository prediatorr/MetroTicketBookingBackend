const express = require("express");
const { getStations, bookTicket, verifyPayment,verifyTicket } = require("../Contollers/clientController");
const { getUniqueStations } = require('../Contollers/stationController');


const router = express.Router();

router.get("/stations", getStations);
router.get("/uniqueStation",getUniqueStations)
router.post("/book-ticket", bookTicket);
router.post("/verify-payment", verifyPayment);
router.post("/verify-ticket", verifyTicket);


module.exports = router;

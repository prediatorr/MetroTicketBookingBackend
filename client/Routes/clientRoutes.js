const express = require("express");
const { getStations, bookTicket } = require("../Contollers/clientController");
const { getUniqueStations } = require('../Contollers/stationController');

const router = express.Router();


router.get('/stations/unique', getUniqueStations);
router.get("/stations", getStations);
router.post("/book-ticket", bookTicket);


module.exports = router;

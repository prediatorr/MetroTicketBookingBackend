const express = require("express");
const { getStations, bookTicket } = require("../Contollers/clientController");
const router = express.Router();

router.get("/stations", getStations);
router.post("/book-ticket", bookTicket);

module.exports = router;

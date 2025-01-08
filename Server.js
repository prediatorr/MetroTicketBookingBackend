const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const adminRoutes = require("./admin/Routes/adminRoutes");
const clientRoutes = require("./client/Routes/clientRoutes"); 
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "Hello World" });
  });

app.use("/api/admin", adminRoutes);
app.use("/api/client", clientRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
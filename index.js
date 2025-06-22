const express = require("express")
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const UserRoute = require("./Route/userRoute")
require("dotenv").config()

const PORT = process.env.PORT || 8000
// const mongoose = require("mongoose")
 const Dbcon = require("./config/dbconn")

const adminRoute = require("./Route/adminRoute")


app.use(cors({
    origin: ["https://git-front-beige.vercel.app/"], // your Vercel frontend
    credentials: true
  }));






// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Parse incoming requests with urlencoded payloads
app.use(bodyParser.urlencoded({ extended: true }));
Dbcon();

app.use("/admin",adminRoute)
app.use("/user",UserRoute)

app.listen(PORT,()=>{
    console.log(`Server Running on port ${PORT}`)
})
















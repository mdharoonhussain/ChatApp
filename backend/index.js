const express = require("express");
const {connection} = require("./db");
const cors = require("cors");
require("dotenv").config();
const {userRouter} = require("./routes/user.router");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user",userRouter);

// app.get("/",(req,res)=>{
//     console.log("Welcome to new Page");
//     res.status(200).send({msg: "working successful"})
// })

app.listen(process.env.PORT || 4500, async () => {
    try {
      await connection;
      console.log("Connected to DB");
    } catch (error) {
      console.log("Error in DB", error);
    }
  });
const mongoose = require("mongoose");

const connection=mongoose.connect(process.env.mongoURL ||"mongodb+srv://mdharoonhussain:mdharoonhussain@cluster0.zoobgnv.mongodb.net/user?retryWrites=true&w=majority")

module.exports = {connection};
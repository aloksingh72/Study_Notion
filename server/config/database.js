
const mongoose = require('mongoose');
require("dotenv").config();

const dbConnect = () =>{
     mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
     })
     .then(() => console.log("DB connection successfully"))
     .catch((err) =>{
        console.log ("Db connection error");
        console.error(err.message);
        process.exit(1);

     } )
};
module.exports = dbConnect;
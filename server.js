const mongoose = require("mongoose");
const dotenv = require("dotenv").config({path: 'config.env'});
const app = require("./app");


(async function connectToDB(){
    try{
        await mongoose.connect
        (process.env.DB_CONNECTION_STRING.replace("<USERNAME>" , process.env.DB_USERNAME).replace
        ("<PASSWORD>" , process.env.DB_PASSWORD));

        console.log("Database connected successfully");
    }catch(err){
        console.log("ERROR CONNECTING THE DATABASE ->" , err);
    }
})();




app.listen(3000 , () => {
    console.log("starting listening to server on port 3000");
});
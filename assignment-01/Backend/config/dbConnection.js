const mongoose = require("mongoose");

const ConnectDb = async ()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URL);
        console.log("Datebase connected Successfully!");

    }catch(err){
      console.log(err);
      process.exit(1);
    }
}

module.exports =ConnectDb;
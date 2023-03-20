const mongoose = require("mongoose");

const dbConnect = () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB successfully connected");
  } catch (error) {
    console.log("MongoDB not connected", "reason : ", error.message);
  }
};

module.exports = dbConnect;

const mongoose = require("mongoose");

const Dbcon = async () => {
  try {
    await mongoose.connect(process.env.DBCON, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    throw err;
  }
};

module.exports = Dbcon;
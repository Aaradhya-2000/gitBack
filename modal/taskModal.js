const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    compday: Number,
    userid: {
        type: mongoose.Types.ObjectId, // ✅ CORRECT
        ref: "user" // reference to the User model
    },
    taskstatus: {type:Boolean,default:false}
});

module.exports = mongoose.model("task", taskSchema);

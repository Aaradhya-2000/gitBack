const UserModal = require("../modal/userModal");
const TaskModal =  require("../modal/taskModal")
const bcrypt = require("bcrypt")

// const bcrypt = require("bcryptjs"); // Make sure this is imported

const loginCheck = async (req, res) => {
  const { email, password } = req.body;

  try {
    const User = await UserModal.findOne({ email: email });
    console.log(User);

    if (!User) {
      return res.status(400).send({ msg: "Invalid Email Id!" });
    }

    const isMatch = await bcrypt.compare(password, User.password); // Compare hashed
    if (!isMatch) {
      return res.status(400).send({ msg: "Invalid Password!" });
    }

    return res.status(200).send({ msg: "Login Successfully!", User });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "Server Error", error: error.message });
  }
};

const MyTaskList =async(req,res)=>{
  // console.log(req.query)
  const  { id } = req.query
  console.log(id)
  // res.send("OKK")
  try {
    const Task = await TaskModal.find({userid:id})
    console.log(Task)
    res.send(Task)
    
  } catch (error) {
    console.log(error)
  }
}

const taskComplete = async(req,res)=>{
   const {id} = req.query
   try {
    const Task= await TaskModal.findByIdAndUpdate(id, {taskstatus:true});
    res.status(201).send({Task:Task, msg:"Succesfully Updated"});
} catch (error) {
console.log(error);
}
}

// controllers/userController.js
const PassChange = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    const user = await UserModal.findById(userId);
    if (!user) return res.status(404).send({ msg: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).send({ msg: "Incorrect old password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.send({ msg: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Server error" });
  }
};




module.exports={
    loginCheck,
    MyTaskList,
    taskComplete,
    PassChange
}
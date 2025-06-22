const adminModel = require("../modal/adminModal")
const userModel = require("../modal/userModal")
const userPass = require("../middleWare/userPass")
var nodemailer = require('nodemailer');
const taskModal = require("../modal/taskModal");
const bcrypt = require("bcrypt");


const login = async(req,res)=>{
   console.log(req.body)
   const { adminId, password }  = req.body
   try{
    const Admin = await adminModel.findOne({"id":adminId})
    if(!Admin){
      res.status(401).send({msg:"invalid user ID"})
    }
    if(Admin.password!= password){
      res.status(401).send({msg:"Invalid Passward"})
    }
    console.log(Admin)
    res.status(200).send({admin:Admin,msg:"Login Succefully"})
   }
   catch(error){
      console.log(error)
   }
}  
// controllers/adminController.js


const userRegister = async (req, res) => {
  const { name, email, designation } = req.body;
  const plainPassword = userPass(); // generate random password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const newUser = await userModel.create({
    name,
    email,
    designation,
    password: hashedPassword,
  });

  // Send Email
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aaradhyaprnjp62@gmail.com',
      pass: 'jxct uxty ckmu kkwv'
    }
  });

  var mailOptions = {
    from: 'aaradhyaprnjp62@gmail.com',
    to: email,
    subject: 'Your Credentials',
    text: `Welcome ${name}!\n\nYour Password: ${plainPassword}\nDesignation: ${designation}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send({ msg: "Email error" });
    } else {
      console.log("Email sent: " + info.response);
      res.send({ msg: "User created and email sent" });
    }
  });
};

const showData = async(req,res)=>{
try {
  const User = await userModel.find();
  res.status(201).send(User);
  
} catch (error) {
    console.log(error)
}
}

const assigntask =(req,res)=>{
  console.log(req.body)
  // res.send("ok")
  const {title,description,compday,userid} = req.body
  try{
    const task = taskModal.create({
      title: title,
      description:description,
      compday:compday,
      userid:userid
    })

   res.status(201).send("succefullt given")
  }
  catch(error){
     console.log(error)
  }
}

const detailTask = async(req,res)=>{
  try {
    const Task= await taskModal.find().populate("userid");
    res.status(200).send(Task);
 } catch (error) {
   console.log(error);
 }
}

const changeTaskStatus = async(req,res)=>{
  const {id} = req.query;
  console.log(req.query);
  try {
       const Task = await taskModal.findByIdAndUpdate(id, {
        taskstatus:false
       })
       res.status(201).send("Succesfully updated!!!");
  } catch (error) {
     console.log(error);
  }
}
const taskDelete = async (req, res) => {
  const { id } = req.query;

  try {
    const deletedTask = await taskModal.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.status(200).json({
      msg: "Task deleted successfully",
      deletedTask,
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports ={
    login,
    userRegister,
    showData,
    assigntask,
    detailTask,
    changeTaskStatus,
    taskDelete
}
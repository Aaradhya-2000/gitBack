const adminModel = require("../modal/adminModal");
const userModel = require("../modal/userModal");
const userPass = require("../middleWare/userPass");
const taskModal = require("../modal/taskModal");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// ✅ Admin Login (fixed)
const login = async (req, res) => {
  const { adminId, password } = req.body;

  try {
    const Admin = await adminModel.findOne({ id: adminId });

    if (!Admin) {
      return res.status(401).send({ msg: "Invalid user ID" });
    }

    // If passwords are hashed (recommended), use bcrypt:
    const isMatch = await bcrypt.compare(password, Admin.password);
    if (!isMatch) {
      return res.status(401).send({ msg: "Invalid Password" });
    }

    return res.status(200).send({ admin: Admin, msg: "Login Successfully" });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Server error" });
  }
};

// ✅ Register New User
const userRegister = async (req, res) => {
  const { name, email, designation } = req.body;
  const plainPassword = userPass();
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  try {
    const newUser = await userModel.create({
      name,
      email,
      designation,
      password: hashedPassword,
    });

    // Email credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aaradhyaprnjp62@gmail.com",
        pass: "jxct uxty ckmu kkwv",
      },
    });

    const mailOptions = {
      from: "aaradhyaprnjp62@gmail.com",
      to: email,
      subject: "Your Credentials",
      text: `Welcome ${name}!\n\nYour Password: ${plainPassword}\nDesignation: ${designation}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).send({ msg: "Email error" });
      } else {
        console.log("Email sent: " + info.response);
        return res.send({ msg: "User created and email sent" });
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "User creation failed" });
  }
};

// ✅ Show All Users
const showData = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Could not fetch users" });
  }
};

// ✅ Assign Task
const assigntask = async (req, res) => {
  const { title, description, compday, userid } = req.body;

  try {
    await taskModal.create({
      title,
      description,
      compday,
      userid,
    });

    return res.status(201).send("Task assigned successfully");

  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Task assignment failed" });
  }
};

// ✅ Get All Tasks with User Info
const detailTask = async (req, res) => {
  try {
    const tasks = await taskModal.find().populate("userid");
    return res.status(200).send(tasks);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Could not load tasks" });
  }
};

// ✅ Update Task Status
const changeTaskStatus = async (req, res) => {
  const { id } = req.query;

  try {
    await taskModal.findByIdAndUpdate(id, {
      taskstatus: false,
    });
    return res.status(200).send("Task status updated successfully");

  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Status update failed" });
  }
};

// ✅ Delete Task
const taskDelete = async (req, res) => {
  const { id } = req.query;

  try {
    const deletedTask = await taskModal.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ msg: "Task not found" });
    }

    return res.status(200).json({
      msg: "Task deleted successfully",
      deletedTask,
    });

  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  login,
  userRegister,
  showData,
  assigntask,
  detailTask,
  changeTaskStatus,
  taskDelete,
};

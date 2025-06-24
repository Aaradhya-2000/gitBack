const adminModel = require("../modal/adminModal");
const userModel = require("../modal/userModal");
const userPass = require("../middleWare/userPass");
const taskModal = require("../modal/taskModal");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// ✅ Admin Login (with bcrypt)
const login = async (req, res) => {
  const { adminId, password } = req.body;

  try {
    const Admin = await adminModel.findOne({ id: adminId });

    if (!Admin) {
      console.log("❌ Admin not found");
      return res.status(401).send({ msg: "❌ Invalid Admin ID" });
    }

    // Debug logs (Remove in production)
    console.log("🔐 Entered Password:", password);
    console.log("🔐 Stored Hashed Password:", Admin.password);

    const isMatch = await bcrypt.compare(password, Admin.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).send({ msg: "❌ Invalid Password" });
    }

    return res.status(200).send({ admin: Admin, msg: "✅ Login Successful" });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send({ msg: "🚨 Server Error" });
  }
};

// ✅ User Registration
const userRegister = async (req, res) => {
  const { name, email, designation } = req.body;
  const plainPassword = userPass(); // Generate random password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  try {
    const newUser = await userModel.create({
      name,
      email,
      designation,
      password: hashedPassword,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aaradhyaprnjp62@gmail.com",
        pass: "jxct uxty ckmu kkwv", // App password
      },
    });

    const mailOptions = {
      from: "aaradhyaprnjp62@gmail.com",
      to: email,
      subject: "Your Task Management Credentials",
      text: `👋 Hello ${name},\n\nYour credentials:\nEmail: ${email}\nPassword: ${plainPassword}\nDesignation: ${designation}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email error:", error);
        return res.status(500).send({ msg: "❌ Email failed" });
      } else {
        console.log("📧 Email sent:", info.response);
        return res.status(200).send({ msg: "✅ User created and email sent" });
      }
    });

  } catch (error) {
    console.error("User registration error:", error);
    return res.status(500).send({ msg: "❌ User creation failed" });
  }
};

// ✅ Show All Users
const showData = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).send(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    return res.status(500).send({ msg: "❌ Could not fetch users" });
  }
};

// ✅ Assign Task
const assigntask = async (req, res) => {
  const { title, description, compday, userid } = req.body;

  try {
    await taskModal.create({ title, description, compday, userid });
    return res.status(201).send("✅ Task assigned successfully");
  } catch (error) {
    console.error("Assign task error:", error);
    return res.status(500).send({ msg: "❌ Task assignment failed" });
  }
};

// ✅ Get All Tasks with User Info
const detailTask = async (req, res) => {
  try {
    const tasks = await taskModal.find().populate("userid");
    return res.status(200).send(tasks);
  } catch (error) {
    console.error("Fetch task details error:", error);
    return res.status(500).send({ msg: "❌ Could not load tasks" });
  }
};

// ✅ Update Task Status
const changeTaskStatus = async (req, res) => {
  const { id } = req.query;

  try {
    await taskModal.findByIdAndUpdate(id, { taskstatus: false });
    return res.status(200).send("✅ Task status updated");
  } catch (error) {
    console.error("Update task status error:", error);
    return res.status(500).send({ msg: "❌ Status update failed" });
  }
};

// ✅ Delete Task
const taskDelete = async (req, res) => {
  const { id } = req.query;

  try {
    const deleted = await taskModal.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ msg: "❌ Task not found" });
    }

    return res.status(200).json({ msg: "✅ Task deleted", deleted });
  } catch (error) {
    console.error("Delete task error:", error);
    return res.status(500).json({ msg: "❌ Server error" });
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

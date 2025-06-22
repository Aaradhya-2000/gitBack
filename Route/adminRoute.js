const express = require("express")
const route = express.Router();


const adminController = require("../Controller/adminController")


route.post("/logincheck",adminController.login)
route.post("/usercreation",adminController.userRegister)
route.get("/showuserdata",adminController.showData)
route.post("/assigntask",adminController.assigntask)
route.get("/taskdetail",adminController.detailTask)
route.get("/changetaskstatus", adminController.changeTaskStatus);
route.delete("/deleteTask",adminController.taskDelete)


module.exports = route
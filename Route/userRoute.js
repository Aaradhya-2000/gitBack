const express = require("express");
const route = express.Router();
const UserController= require("../Controller/userController");

route.post("/userlogin", UserController.loginCheck);
route.get("/mytask",UserController.MyTaskList)
route.get("/completeTask",UserController.taskComplete)
route.post("/changepassword",UserController.PassChange)

module.exports=route;
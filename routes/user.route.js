const express = require("express");
const { isUser } = require("../middlewares/auth.middleware");
const {
    createUser,
    changeStatus,
    distanceCalculate,
    userDetail
  } = require("../controllers/user.controller");

const router = express.Router();

router.post("/add",  createUser);

router.put("/update",isUser,changeStatus)


router.post("/distance/:requestId",isUser,distanceCalculate)

router.post("/get",isUser,userDetail)

module.exports = router;
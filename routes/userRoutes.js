const express = require("express");
const router = express.Router();

const userController = require(`${__dirname}/../controllers/userController`);
const authController = require(`${__dirname}/../controllers/authController`);



router.use(authController.protect);

// User operations
router.get("/getMe" , userController.getMe);
router.delete('/deleteMe'  , userController.deleteMe);
router.patch('/updateMe'  , userController.updateMe);



router.use(authController.restrictTo('admin'));

// Admin operations
router.get("/" ,userController.getAllUsers);
router.get("/:id"  , userController.getUser);
router.patch("/:id"  , userController.updateUser);
router.delete("/:id"  , userController.deleteUser);
router.post("/createUser" ,userController.createUser);






module.exports = router;
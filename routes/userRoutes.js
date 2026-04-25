const express = require("express");
const router = express.Router();

const userController = require(`${__dirname}/../controllers/userController`);
const authController = require(`${__dirname}/../controllers/authController`);



router.use(authController.protect);

// User operations
router.get("/getMe" , userController.getMe);
router.delete('/deleteMe'  , userController.deleteMe);
router.patch('/updateMe'  , userController.updateMe);




// Admin operations
router.use(authController.restrictTo('admin'));
router.get("/" ,userController.getAllUsers);
router.get("/:userId"  , userController.getUser);
router.patch("/:userId"  , userController.updateUser);
router.delete("/:userId"  , userController.deleteUser);
router.post("/createUser" ,userController.createUser);






module.exports = router;
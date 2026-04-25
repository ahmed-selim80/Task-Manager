const express = require("express");
const router = express.Router();

const userController = require(`${__dirname}/../controllers/userController`);
const authController = require(`${__dirname}/../controllers/authController`);




router.get("/" , authController.protect, authController.restrictTo('admin') ,userController.getAllUsers);
router.get("/:userId" , authController.protect , authController.restrictTo('admin') , userController.getUser);
router.patch("/:userId" , authController.protect , authController.restrictTo('admin') , userController.updateUser);
router.delete("/:userId" , authController.protect , authController.restrictTo('admin') , userController.deleteUser);

router.get("/getMe" , authController.protect, userController.getMe);


// As admin I mean
router.post("/createUser" , authController.protect, authController.restrictTo('admin') ,userController.createUser);

router.delete('/deleteMe' , authController.protect , userController.deleteMe);
router.patch('/updateMe' , authController.protect , userController.updateMe);





module.exports = router;
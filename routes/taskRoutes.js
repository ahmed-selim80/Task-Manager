const express = require("express");
const authController = require(`${__dirname}/../controllers/authController`);
const taskController = require(`${__dirname}/../controllers/taskController`);
const router = express.Router();



router.use(authController.protect);


router.post('/createTask' , taskController.createTask);


router.route('/').get(taskController.getAllTasks)
router.get('/getTaskStats' , taskController.getTaskStats);



router.route('/:id')
.get(taskController.getTask)
.patch(taskController.updateTask)
.delete(taskController.deleteTask);


module.exports = router;
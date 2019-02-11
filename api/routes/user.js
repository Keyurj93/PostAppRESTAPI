const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

// register
router.post("/signup",UserController.createUser);

// login
router.post("/login",UserController.userLogin);

module.exports=router;

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { validateRegister } = require('../middlewares/userValidation');

router.post('/register', validateRegister, UserController.register);
router.post('/login', UserController.login);

module.exports = router;
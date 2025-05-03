
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { validateRegister } = require('../middlewares/userValidation');
const { validateResetPassword } = require('../middlewares/userValidation');


router.post('/register', validateRegister, UserController.register);
router.post('/login', UserController.login);

router.post('/recover', UserController.recoverPassword);
router.post('/reset-password', validateResetPassword, UserController.resetPassword);
module.exports = router;
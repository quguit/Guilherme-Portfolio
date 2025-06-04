
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateRegister } = require('../middlewares/userValidation');
const { validateResetPassword } = require('../middlewares/userValidation');


router.post('/register', validateRegister, userController.register);
router.post('/login', userController.login);
router.get('/', userController.list);
router.post('/recover', userController.recoverPassword);
router.post('/reset-password', validateResetPassword, userController.resetPassword);
module.exports = router;
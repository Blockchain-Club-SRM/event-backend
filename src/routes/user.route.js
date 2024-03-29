const express = require('express');
// const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/user.validation');
const userController = require('../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser)
  .get(validate(userValidation.getUsers), userController.getUsers);
router.route('/mail').post(validate(userValidation.sendMail), userController.sendMail);
router.route('/mail-certificate').post(validate(userValidation.sendCertificateMail), userController.sendCertificateMail);
router.route('/spot').post(validate(userValidation.createUser), userController.createUserOnSpot);
router.route('/qr/:code').get(validate(userValidation.getUserByQrCode), userController.getUserByQrCode);

router
  .route('/:userId')
  .get(validate(userValidation.getUser), userController.getUser)
  .patch(validate(userValidation.updateUser), userController.updateUser)
  .delete(validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;

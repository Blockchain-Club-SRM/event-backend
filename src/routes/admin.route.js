const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const adminValidation = require('../validations/admin.validation');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageAdmins'), validate(adminValidation.createAdmin), adminController.createAdmin)
  .get(auth('getAdmins'), validate(adminValidation.getAdmins), adminController.getAdmins);

router
  .route('/:adminId')
  .get(auth('getAdmins'), validate(adminValidation.getAdmin), adminController.getAdmin)
  .patch(auth('manageAdmins'), validate(adminValidation.updateAdmin), adminController.updateAdmin)
  .delete(auth('manageAdmins'), validate(adminValidation.deleteAdmin), adminController.deleteAdmin);

module.exports = router;

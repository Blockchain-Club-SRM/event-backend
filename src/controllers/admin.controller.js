const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { adminService } = require('../services');

const createAdmin = catchAsync(async (req, res) => {
  const admin = await adminService.createAdmin(req.body);
  res.status(httpStatus.CREATED).send(admin);
});

const getAdmins = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'email']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await adminService.queryAdmins(filter, options);
  res.send(result);
});

const getAdmin = catchAsync(async (req, res) => {
  const admin = await adminService.getAdminById(req.params.adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }
  res.send(admin);
});

const updateAdmin = catchAsync(async (req, res) => {
  const admin = await adminService.updateAdminById(req.params.adminId, req.body);
  res.send(admin);
});

const deleteAdmin = catchAsync(async (req, res) => {
  await adminService.deleteAdminById(req.params.adminId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
};

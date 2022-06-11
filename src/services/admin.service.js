const httpStatus = require('http-status');
const { Admin } = require('../models');
const ApiError = require('../utils/ApiError');

const createAdmin = async (adminBody) => {
  if (await Admin.isEmailTaken(adminBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return Admin.create(adminBody);
};

const queryAdmins = async (filter, options) => {
  const admins = await Admin.paginate(filter, options);
  return admins;
};

const getAdminById = async (id) => Admin.findById(id);

const getAdminByEmail = async (email) => Admin.findOne({ email });

const updateAdminById = async (adminId, updateBody) => {
  const admin = await getAdminById(adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }
  if (updateBody.email && (await Admin.isEmailTaken(updateBody.email, adminId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(admin, updateBody);
  await admin.save();
  return admin;
};

const deleteAdminById = async (adminId) => {
  const admin = await getAdminById(adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }
  await admin.remove();
  return admin;
};

module.exports = {
  createAdmin,
  queryAdmins,
  getAdminById,
  getAdminByEmail,
  updateAdminById,
  deleteAdminById,
};

const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const getUserById = async (id) => User.findById(id);
const getUserByRegisterNumber = async (registerNumber) => User.findOne({ registerNumber });
const getUserByQrCode = async (qrCode) => User.findOne({ qrCode });
const getUserByEmail = async (email) => User.findOne({ email });
const getUserByPhoneNumber = async (phoneNumber) => User.findOne({ phoneNumber });

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (await User.isPhoneTaken(userBody.phoneNumber)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone Number already taken');
  }
  if (await User.isRegisterTaken(userBody.registerNumber)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Register Number already taken');
  }
  return User.create(userBody);
};

const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (updateBody.phone && (await User.isPhoneTaken(updateBody.phone, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone already taken');
  }
  if (updateBody.registerNumber && (await User.isRegisterTaken(updateBody.registerNumber, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Register Number already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByPhoneNumber,
  getUserByRegisterNumber,
  getUserByQrCode,
  updateUserById,
  deleteUserById,
};

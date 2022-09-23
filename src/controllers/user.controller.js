const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, tokenService, emailService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  await emailService.sendQrCodeEmail(user.email, user.name, user.qrCode);
  res.status(httpStatus.CREATED).send(user);
});
const createUserOnSpot = catchAsync(async (req, res) => {
  req.body.isPresent = true;
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'name',
    'email',
    'registerNumber',
    'phoneNumber',
    'hasEaten',
    'isPresent',
    'qrCode',
    'markedBy',
  ]);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const sendMail = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'name',
    'email',
    'registerNumber',
    'phoneNumber',
    'isPresent',
    'hasEaten',
    'qrCode',
    'markedBy',
  ]);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  await result.results.map(async (user) => {
    await emailService.sendMiscMail(user.email, user.name);
  });
  res.status(200).send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const getUserByQrCode = catchAsync(async (req, res) => {
  // const user = await tokenService.verifyQrCode(req.params.code);
  const user = await userService.getUserByRegisterNumber(req.params.code);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  if (req.body.isPresent) {
    req.body.markedBy = req.user;
  }
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  sendMail,
  updateUser,
  deleteUser,
  createUserOnSpot,
  getUserByQrCode,
};

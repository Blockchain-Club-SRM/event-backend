const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const adminService = require('./admin.service');
const { Token, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

const generateToken = (adminId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: adminId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (token, adminId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    admin: adminId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, admin: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

const verifyQrCode = async (code) => {
  const payload = jwt.verify(code, config.jwt.qrSecret);
  const tokenDoc = await User.findOne({ qrCode: code, _id: payload.id });
  if (!tokenDoc) {
    throw new Error('Code not found');
  }
  return tokenDoc;
};

const generateAuthTokens = async (admin) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(admin.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(admin.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, admin.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const generateResetPasswordToken = async (email) => {
  const admin = await adminService.getAdminByEmail(email);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No admins found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(admin.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, admin.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

const generateVerifyEmailToken = async (admin) => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(admin.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, admin.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  verifyQrCode,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};

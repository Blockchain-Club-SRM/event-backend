const Joi = require('joi');
const { registerNumber, phoneNumber, objectId } = require('./custom.validation');

exports.createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    phoneNumber: Joi.string().custom(phoneNumber),
    registerNumber: Joi.string().required().custom(registerNumber),
  }),
};

exports.getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    phoneNumber: Joi.string().custom(phoneNumber),
    registerNumber: Joi.string().custom(registerNumber),
    isPresent: Joi.boolean(),
    qrCode: Joi.string(),
    markedBy: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

exports.getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
exports.getUserByQrCode = {
  params: Joi.object().keys({
    code: Joi.string(),
  }),
};

exports.updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      email: Joi.string().email(),
      phoneNumber: Joi.string().custom(phoneNumber),
      registerNumber: Joi.string().custom(registerNumber),
      isPresent: Joi.boolean(),
    })
    .min(1),
};

exports.deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

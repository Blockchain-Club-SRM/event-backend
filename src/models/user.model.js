const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { tokenService } = require('../services');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name Required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email Required'],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone Number Required'],
      trim: true,
      lowercase: true,
    },
    registerNumber: {
      type: String,
      required: [true, 'Registration Number Required'],
      trim: true,
      lowercase: true,
    },
    qrCode: {
      type: String,
      required: true,
      unique: true,
    },
    isPresent: {
      type: Boolean,
    },
    markedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Admin',
    },
    markedAt: {
      type: Date,
    },
    registeredTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isPresent = async function (registerNumber) {
  const user = await this.findOne({
    registerNumber,
    isPresent: true,
  });
  return !!user;
};

userSchema.statics.isPhoneTaken = async function (phoneNumber, excludeUserId) {
  const user = await this.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isRegisterTaken = async function (registerNumber, excludeUserId) {
  const user = await this.findOne({
    registerNumber,
    _id: { $ne: excludeUserId },
  });
  return !!user;
};

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const user = this;
    user.qrCode = await tokenService.generateQrCode(user);
  }
  next();
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('isPresent')) {
    user.markedAt = Date.now();
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

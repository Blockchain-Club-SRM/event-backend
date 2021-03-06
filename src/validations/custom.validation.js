exports.objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

exports.password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

exports.phoneNumber = (value, helpers) => {
  if (!value.match('^[0-9]*$')) {
    return helpers.message('Please provide a valid phone number');
  }
  return value;
};

exports.registerNumber = (value, helpers) => {
  if (!value.match('^[a-z0-9A-Z]{15}$')) {
    return helpers.message('Please provide a valid register number');
  }
  return value;
};

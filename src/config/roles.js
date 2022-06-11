const allRoles = {
  user: ['getUsers'],
  maintainer: ['getUsers', 'manageUsers', 'getAdmins', 'manageAdmins'],
  admin: ['getUsers', 'manageUsers'],
};

exports.roles = Object.keys(allRoles);
exports.roleRights = new Map(Object.entries(allRoles));

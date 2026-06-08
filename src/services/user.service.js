const User = require('../models/user.model');

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const getUsers = async () => {
  return await User.find();
};

module.exports = {
  createUser,
  getUsers,
};

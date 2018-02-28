const mongoose = require('mongoose');
const redis = require('../utils/redis');
const logger = require('../utils/logger');

const loggerDispatcher = 'UserModel';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
});

userSchema.statics.getAll = async function userGetAll() {
  let data;

  try {
    data = await redis.getAsync('users');
  } catch (err) {
    logger.error(err, { dispatcher: loggerDispatcher, from: 'userGetAll' });
  }

  if (data) return JSON.parse(data);
  data = await this.find().exec();

  try {
    redis.client.set('users', JSON.stringify(data), 'EX', 60);
  } catch (err) {
    logger.error(err, { dispatcher: loggerDispatcher, from: 'userGetAll' });
  }

  return data;
};

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;

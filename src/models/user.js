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

userSchema.statics.getAll = function userGetAll() {
  const Model = this; // not needed if only fat arrows functions are used below

  /* eslint-disable consistent-return */
  return new Promise((resolve, reject) => {
    redis.getAsync('users')
      .then((data) => {
        if (data) {
          resolve(JSON.parse(data));
        } else {
          return Model.find().exec();
        }
      }, (err) => {
        logger.error(err, { dispatcher: loggerDispatcher, from: 'userGetAll' });
        return Model.find().exec();
      })
      .then((data) => {
        if (data) {
          resolve(data);
          return data;
        }
      })
      .then((data) => {
        if (data) {
          redis.client.set('users', JSON.stringify(data), 'EX', 60);
        }
      })
      .catch(err => reject(err));
  });
};

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;

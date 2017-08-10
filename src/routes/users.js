const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const { makeErrorOperational } = require('../utils/error');

const router = express.Router();
const jsonParser = bodyParser.json();

// get all users
router.get('/', (req, res, next) => {
  User.getAll()
    .then((users) => {
      res.send({
        status: 200,
        data: users,
      });
    })
    .catch(err => next(makeErrorOperational(err)));
});

// get user by id
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  User.findById(id).exec()
    .then((user) => {
      const status = user === null ? 404 : 200;

      res.status(status).send({
        status,
        data: user,
      });
    })
    .catch(err => next(makeErrorOperational(err)));
});

// create user
router.post('/', jsonParser, (req, res, next) => {
  User.create(req.body)
    .then((user) => {
      res.status(201).send({
        status: 201,
        data: user,
      });
    })
    .catch(err => next(makeErrorOperational(err)));
});

// update user by id
router.put('/:id', jsonParser, (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  User.findByIdAndUpdate(id, body).exec()
    .then((user) => {
      res.send({
        status: 200,
        data: user,
      });
    })
    .catch(err => next(makeErrorOperational(err)));
});

// delete user by id
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  User.findByIdAndRemove(id).exec()
    .then((user) => {
      res.send({
        status: 200,
        data: user,
      });
    })
    .catch(err => next(makeErrorOperational(err)));
});

module.exports = router;

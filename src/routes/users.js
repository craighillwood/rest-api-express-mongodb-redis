const express = require('express');
const bodyParser = require('body-parser');
const usersController = require('../controllers/users');
const { asyncErrorDecorator } = require('../utils/error');

const router = express.Router();
const jsonParser = bodyParser.json();

// get all users
router.get('/', asyncErrorDecorator(usersController.getAll));

// get user by id
router.get('/:id', asyncErrorDecorator(usersController.getById));

// create user
router.post('/', jsonParser, asyncErrorDecorator(usersController.create));

// update user by id
router.put('/:id', jsonParser, asyncErrorDecorator(usersController.updateById));

// delete user by id
router.delete('/:id', asyncErrorDecorator(usersController.deleteById));

module.exports = router;

const User = require('../models/user');

const getAll = async (req, res) => {
  const users = await User.getAll();

  res.send({
    status: 200,
    data: users,
  });
};

const getById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).exec();
  const status = user === null ? 404 : 200;

  res.status(status).send({
    status,
    data: user,
  });
};

const create = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).send({
    status: 201,
    data: user,
  });
};

const updateById = async (req, res) => {
  const { body, params: { id } } = req;
  const user = await User.findByIdAndUpdate(id, body).exec();

  res.send({
    status: 200,
    data: user,
  });
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndRemove(id).exec();

  res.send({
    status: 200,
    data: user,
  });
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};

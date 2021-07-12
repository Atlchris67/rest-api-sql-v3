'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
//const { User } = require('./models');
const { sequelize } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');
var initModels = require("../models/init-models");

// Construct a router instance.
const router = express.Router();
let models = initModels(sequelize);
let User = models.user;
let Course = models.course;

// Route that returns a list of users.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;

  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress
  });
}));

// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
  try {
    const user = req.body;
    // const userJson = JSON.parse(`{
    //   "firstName": "${user.firstName}",
    //   "lastName": "${user.lastName}",
    //   "emailAddress": "${user.emailAddress}",
    //   "password": "${user.password}"

    // }`)
    let userFName = user.firstName;

    await User.create(req.body);
    res.status(201).json({
      message: 'Account successfully created!'
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({
        errors
      });
    } else {
      throw error;
    }
  }
}));

module.exports = router;

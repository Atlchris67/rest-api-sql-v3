'use strict';

const express = require('express');
const {
  asyncHandler
} = require('../middleware/async-handler');
//const { User } = require('./models');
const {
  sequelize
} = require('../models');
const {
  authenticateUser
} = require('../middleware/auth-user');
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

    if (user.password) {
      //hashing the password before it gets stored.
      user.password = bcryptjs.hashSync(user.password);
    }
    //check if user already exists
    let existingUser = await User.findOne({
      where: {
        emailAddress: user.emailAddress
      }
    });
    if (!existingUser) {
      await User.create(user);
      console.log('Account successfully created!');
      res.status(201).location('/').end();
    } else {
      res.status(400).json({
        "Error": "The email already exists."
      })
    }
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

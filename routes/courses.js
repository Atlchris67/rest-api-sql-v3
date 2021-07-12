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

// Route that returns a list of courses.
router.get('/courses', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  const courseList = await Course.findAll({
    include: [{
      model: User,
      as: 'user',
      attributes: {
        exclude: [
          'password',
          'createdAt',
          'updatedAt'
        ]
      }
    }]
  });
  console.log(console.log("All courses:", JSON.stringify(courseList, null, 2)))
  res.json(courseList);
}));

/* GET individual article. */
router.get("/courses/:id", asyncHandler(async (req, res) => {
  const user = req.currentUser;
  const course = await Course.findByPk(req.params.id, {
    include: [{
      model: User,
      as: 'user',
      attributes: {
        attributes: {
          exclude: [
            'password',
            'createdAt',
            'updatedAt'
          ]
        }
      }
    }],
    attributes: {
      exclude: [
        'createdAt',
        'updatedAt'
      ]
    }
  });
  console.log(console.log("All courses:", JSON.stringify(course, null, 2)))
  res.json(course);
}));


// Route that creates a new courses.
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  try {

    await Course.create(req.body);
    res.status(201).json({
      message: 'Course successfully created.'
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

// Send a PUT request to /quotes/:id to UPDATE (edit) a quote
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await await Course.findByPk(req.params.id);
  if (req.currentUser.id === course.userId) {
    try {
      await course.update(req.body);
      res.status(204).end();
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json(errors);
      } else {
        throw error;
      }
    }
  } else {
    //if it does not match, access denied
    res.status(403).json('Access Denied, current user doesn\'t own the requested course');
  }
}));

// Send a DELETE request to /quotes/:id DELETE a quote 
router.delete("/courses/:id", authenticateUser, asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  if (req.currentUser.id === course.userId) {
    await Course.deleteQuote(course);
    res.status(204).end();
  } else {
    //if it does not match, access denied
    res.status(403).json('Access Denied, current user doesn\'t own the requested course');
  }
}));

module.exports = router;

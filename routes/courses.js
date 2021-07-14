'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
//const { User } = require('./models');
const { sequelize } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');
var initModels = require("../models/init-models");

//https://newbedev.com/javascript-express-validator-replace-code-example
const { body, validationResult } = require('express-validator');

// Construct a router instance.
const router = express.Router();
let models = initModels(sequelize);
let User = models.user;
let Course = models.course;

// Route that returns a list of courses.
router.get('/courses',  asyncHandler(async (req, res) => {
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
    }],
    attributes: {
      exclude: [
        'createdAt',
        'updatedAt'
      ]
    }
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

    const course = await Course.create(req.body);
    console.log('Course successfully created.');
    res.status(201).location(`/api/courses/${course.id}`).end();

  } catch (error) {

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError' || error.name ==='SequelizeForeignKeyConstraintError') {
      let errors = error.errors ? error.errors.map(err => err.message): { error: 'Could not insert record, incomplete data.' };
      res.status(400).json(errors);
    } else {
      throw error;
    }
  }
}));

// Send a PUT request to /quotes/:id to UPDATE (edit) a quote
router.put('/courses/:id', authenticateUser, [
  body("title").isLength({min:1}).withMessage("Please enter a title"),
  body("description").isLength({min:1}).withMessage("Please enter a description")
 ], asyncHandler(async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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
    //if id does not match, access denied
    res.status(403).json('Access Denied, current user doesn\'t own the requested course');
  }
}));

// Send a DELETE request to /quotes/:id DELETE a quote 
router.delete("/courses/:id", authenticateUser, asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  if (!course){
    res.status(403).json( { error: 'Course not found.' });
    return;
  }
  if (req.currentUser.id === course.userId) {
    try {
    await course.destroy();
    res.status(204).end();
    } catch (error){
      const errors = error.errors.map(err => err.message);
      res.status(400).json(errors);

    }
  } else {
    //if it does not match, access denied
    res.status(403).json('Access Denied, current user doesn\'t own the requested course');
  }
}));

module.exports = router;

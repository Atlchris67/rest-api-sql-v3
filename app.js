'use strict';

// load modules
const express = require('express');

const morgan = require('morgan');
const users = require('./routes/users');
const courses = require('./routes/courses');
const { sequelize } = require('./models');
const SequelizeAuto = require('sequelize-auto');
var initModels = require("./models/init-models").initModels; 
var config = require("./config/config");

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// Setup request body JSON parsing.
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Add routes.
app.use('/api', users);
app.use('/api', courses);
// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);
// Test the database connection.
(async () => {
  try {
    //await sequelize.authenticate();
    let models = initModels(sequelize);
    let User = models.user;
    let Course = models.course;
    Course.findOne({
      where: {
        "userId": "2"
      },
      include: [{
        model: User,
        as: "user"
      }]
    }).then(course => {
      console.log(course);
    });
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();


//Used https://github.com/sequelize/sequelize-auto to write out the initial models.
// const auto = new SequelizeAuto('fsjstd-restapi.db','', '',{
//   dialect: 'sqlite',
//   directory: './models', // where to write files
//   port: 'port',
//   caseModel: 'c', // convert snake_case column names to camelCase field names: user_id -> userId
//   caseFile: 'c', // file names created for each model use camelCase.js not snake_case.js
//   singularize: true, // convert plural table names to singular model names
// })
// auto.run().then(data => {
//   console.log(data.tables);      // table and field list
//   console.log(data.foreignKeys); // table foreign key list
//   console.log(data.indexes);     // table indexes
//   console.log(data.hasTriggerTables); // tables that have triggers
//   console.log(data.relations);   // relationships between models
//   console.log(data.text)         // text of generated models
// });

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});


//add course delete
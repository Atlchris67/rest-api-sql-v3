'use strict';

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = function(sequelize) {
  class User extends Model {}
  return sequelize.define('user', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      validate: {
          notEmpty: {
              msg: 'Please enter a valid first name.'
          }
      }
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      validate: {
          notEmpty: {
              msg: 'Please enter a valid last name.'
          }
      }
    },
    emailAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      unique: {
        args: true,
        msg: 'Email address is already in use.'
      },
      validate: {
        notEmpty: {
          msg: 'Email address cannot be empty.'
        },
        isEmail: {
          args:true,
          msg: 'Please enter a valid email address.'
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required',
        },
        notEmpty: {
          msg: 'Please provide a password',
        },
      },
    },
  }, {
    sequelize,
    tableName: 'Users',
    timestamps: true,
    indexes: [
      {
        name: "sqlite_autoindex_Users_1",
        unique: true,
        fields: [
          { name: "emailAddress" },
        ]
      },
    ]
  });
};

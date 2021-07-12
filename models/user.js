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
      defaultValue: ""
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    emailAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      unique: true
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
        len: {
          args: [8, 20],
          msg: 'The password should be between 8 and 20 characters in length',
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

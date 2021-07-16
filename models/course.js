const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('course', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      validate: {
        notEmpty: {
          msg: 'Please enter a title.'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
      validate: {
        notEmpty: {
          msg: 'Please enter a decription.'
        }
      },
    },
    estimatedTime: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    materialsNeeded: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: -1,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Courses',
    timestamps: true
  });
};

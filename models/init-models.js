var DataTypes = require("sequelize").DataTypes;
var _course = require("./course");
var _user = require("./user");

function initModels(sequelize) {
  var course = _course(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  course.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(course, { as: "Courses", foreignKey: "userId"});

  return {
    course,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

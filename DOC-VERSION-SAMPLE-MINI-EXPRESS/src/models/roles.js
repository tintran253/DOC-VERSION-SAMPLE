
module.exports = function (sequelize, DataTypes) {
    var roles = sequelize.define('roles', {
        name: {
            type: DataTypes.STRING
        },
        permissions: {
            type: DataTypes.ARRAY(DataTypes.JSON)
        }
    });
    //sides.associate = function (models) {

    //}
    return roles;
};
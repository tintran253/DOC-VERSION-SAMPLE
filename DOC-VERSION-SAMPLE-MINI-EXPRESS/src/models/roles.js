
module.exports = function (sequelize, DataTypes) {
    var sides = sequelize.define('sides', {
        name: {
            type: DataTypes.STRING
        },
        permissions: {
            type: DataTypes.ARRAY(sequelize.ARRAY())
        }
    });
    //sides.associate = function (models) {

    //}
    return sides;
};
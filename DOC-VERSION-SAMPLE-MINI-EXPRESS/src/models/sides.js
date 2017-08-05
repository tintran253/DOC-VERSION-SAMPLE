

module.exports = function (sequelize, DataTypes) {
    var sides = sequelize.define('sides', {
        name: {
            type: DataTypes.STRING
        },
        shortName: {
            type: DataTypes.STRING
        }
    });
    //sides.associate = function (models) {
        
    //}
    return sides;
};
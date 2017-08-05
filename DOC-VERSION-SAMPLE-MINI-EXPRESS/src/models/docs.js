
module.exports = function (sequelize, DataTypes) {
    var docs = sequelize.define('docs', {
        title: {
            type: DataTypes.STRING
        },
        url: {
            type: DataTypes.STRING
        },
        content: {
            type: DataTypes.TEXT
        }        
    });
    docs.associate = function (models) {
        docs.belongsTo(models.users, { as: 'createdBy' });
        docs.hasMany(models.docsVersions);
    }
    return docs;
};
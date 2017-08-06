

const { SIDES, FEATURES, ROLE, PERMISSIONS } = require('../common/const/authorize');

module.exports = function (models) {
    return models.sides.findOne({}).then(function (res) {
        if (res === null) {
            return models.sides.bulkCreate([
                SIDES.IVFAS,
                SIDES.IVFMD,
                SIDES.IVFVH,
                SIDES.PKNL,
                SIDES.IVFMD_PNH
            ]);
        }
        return 1;
    });
};
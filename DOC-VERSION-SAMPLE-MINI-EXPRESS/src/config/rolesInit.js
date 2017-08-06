const { FEATURES, ROLE, PERMISSIONS } = require('../common/const/authorize');

module.exports = function (models) {
    return models.roles.findOne({}).then(function (res) {
        if (res === null) {
            return models.roles.bulkCreate([
                {
                    name: ROLE.ROOT,
                    permissions: [
                        {
                            feature: FEATURES.DOCUMENT,
                            permissions: [
                                PERMISSIONS.READ,
                                PERMISSIONS.WRITE,
                                PERMISSIONS.EDIT,
                                PERMISSIONS.APPROVE
                            ]
                        },
                        {
                            feature: FEATURES.USER,
                            permissions: [
                                PERMISSIONS.READ,
                                PERMISSIONS.WRITE,
                                PERMISSIONS.AUTHORIZE
                            ]
                        }
                    ]
                }, {
                    name: ROLE.ADMIN,
                    permissions: [
                        {
                            feature: FEATURES.DOCUMENT,
                            permissions: [
                                PERMISSIONS.READ,
                                PERMISSIONS.WRITE,
                                PERMISSIONS.EDIT,
                                PERMISSIONS.APPROVE
                            ]
                        }
                    ]
                },
                {
                    name: ROLE.MOD,
                    permissions: [
                        {
                            feature: FEATURES.DOCUMENT,
                            permissions: [
                                PERMISSIONS.READ,
                                PERMISSIONS.WRITE,
                                PERMISSIONS.EDIT,
                            ]
                        }
                    ]
                },
                {
                    name: ROLE.USER,
                    permissions: [
                        {
                            feature: FEATURES.DOCUMENT,
                            permissions: [
                                PERMISSIONS.READ
                            ]
                        }
                    ]
                }
            ])
        }
        return 1;
    });
};
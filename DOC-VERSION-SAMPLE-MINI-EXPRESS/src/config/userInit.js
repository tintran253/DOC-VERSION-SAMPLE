const  { SIDES, FEATURES, ROLES, PERMISSIONS } =require( '../common/const/authorize');

module.exports = function (models) {
    return models.users.findOne({ where: { username: ROLES.ROOT } }).then(function (res) {
        if (res === null) {
            return models.users.create({
                username: ROLES.ROOT,
                password: ROLES.ROOT,
                sides: [SIDES.ALL],
                permissions: [
                    {
                        side: SIDES.ALL,
                        name: ROLES.ROOT,
                        permissions: [{
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
                    }
                ],
                isRoot: true,
                isSystem: true,
                active: true
            });
        }
        return 1;
    });
};
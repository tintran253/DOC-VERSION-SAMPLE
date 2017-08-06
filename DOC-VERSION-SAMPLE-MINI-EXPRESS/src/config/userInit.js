const  { SIDE, FEATURES, ROLE, PERMISSIONS } =require( '../common/const/authorize');

module.exports = function (models) {
    return models.users.findOne({ where: { username: ROLE.ROOT } }).then(function (res) {
        if (res === null) {
            return models.users.create({
                username: ROLE.ROOT,
                password: ROLE.ROOT,
                permissions: [
                    {
                        side: SIDE.ALL,
                        name: ROLE.ROOT,
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
                isRoot: true
            });
        }
        return 1;
    });
};
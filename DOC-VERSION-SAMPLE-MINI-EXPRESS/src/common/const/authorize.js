module.exports.ROLES = {
    ROOT: 'root',
    ADMIN: 'admin',
    MOD: 'mod',
    USER: 'user'
};

module.exports.FEATURES = {
    DOCUMENT: 'document',
    USER: 'user',
};

module.exports.PERMISSIONS = {
    READ: 'read',
    WRITE: 'write',
    APPROVE: 'approve',
    EDIT: 'edit',
    AUTHORIZE: 'authorize'
};

module.exports.SIDES = {
    ALL: 'all',
    PKNL: {
        name: 'PKNL',
        shortName: 'PKNL'
    }
    ,
    IVFMD: {
        name: 'IVFMD',
        shortName: 'IVFMD'
    }
    ,
    IVFAS: {
        name: 'IVFAS',
        shortName: 'IVFAS'
    }
    ,
    IVFVH: {
        name: 'IVFVH',
        shortName: 'IVFVH'
    },
    IVFMD_PNH: {
        name: 'IVFMD - Phú Nhuận',
        shortName: 'IVFMD_PNH'
    }
}
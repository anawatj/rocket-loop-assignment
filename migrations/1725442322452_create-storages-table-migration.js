/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {

    pgm.createTable('storages',
        {
            id:{type:'serial', primaryKey: true},
            name:{type:'varchar(100)',notNull:true},
            maximum_capacity:{type:'integer',notNull:true},
            refrigerated:{type:'integer',notNull:true}
        }
    )
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('storages')
};

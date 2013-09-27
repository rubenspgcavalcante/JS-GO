/**
 * JSGO global namespace
 * @namespace
 */
GO = {};

/**
 * Query env namespace
 * @namespace
 */
GO.query = {};

/**
 * Describes the query types
 * @readonly
 * @enum {Number}
 */
GO.query.type = {
    SELECT: 0,
    DELETE: 1,
    UPDATE: 2
};

/**
 * @constant {String}
 * @default
 */
GO.query.WILDCARD = "*";

/**
 * Describes the query operators
 * @readonly
 * @enum {Number}
 */
GO.op = {
    TAUTOLOGICAL: 0,
    CONTRADICTORY: 1,
    EQ: 2,
    NEQ: 3,
    GT: 4,
    GTE: 5,
    MT: 6,
    MTE: 7,
    LIKE: 8,
    HAS: 9
};

/**
 * Describes the order types
 * @readonly
 * @enum {Number}
 */
GO.order = {
    ASC: 0,
    DESC: 1
};
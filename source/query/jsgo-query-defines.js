/**
 * JSGO global namespace
 * @namespace
 * @property {Object} query Defines the query enums
 */
GO = {
    query: {}
};

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
 * Describes the query operators
 * @readonly
 * @enum {Number}
 */
GO.query.op = {
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
GO.query.order = {
    ASC: 0,
    DESC: 1
};
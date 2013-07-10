/**
 * Contains enumerations used into the jsgo
 * @enum {Object}
 */
JSGO = new Object();

Object.defineProperty(JSGO, "OPERATOR", {
  enumerable: true,
  configurable: false,
  writable: false,
  value: {}
});

Object.defineProperty(JSGO, "METHOD", {
  enumerable: true,
  configurable: false,
  writable: false,
  value: {}
});

Object.defineProperty(JSGO, "ORDER", {
  enumerable: true,
  configurable: false,
  writable: false,
  value: {}
});

Object.defineProperty(JSGO, "FILTER", {
	  enumerable: true,
	  configurable: false,
	  writable: false,
	  value: {}
});

/*
 * Logic operators used in Filter object
 */
Object.defineProperty(JSGO.OPERATOR, "TAUTOLOGICAL", {
	enumerable: true,
	configurable: false,
	writable: false,
	value: "taut"
});

Object.defineProperty(JSGO.OPERATOR, "CONTRADICTORY", {
	enumerable: true,
	configurable: false,
	writable: false,
	value: "contr"
});

Object.defineProperty(JSGO.OPERATOR, "EQ", {
  enumerable: true,
  configurable: false,
  writable: false,
  value: "eq"
});

Object.defineProperty(JSGO.OPERATOR, "NEQ", {
  enumerable: true,
  configurable: false,
  writable: false,
  value: "neq"
});

Object.defineProperty(JSGO.OPERATOR, "GT", {
	enumerable: true,
	configurable: false,
	writable: false,
	value: "gt"
});

Object.defineProperty(JSGO.OPERATOR, "GTE", {
	enumerable: true,
	configurable: false,
	writable: false,
	value: "gte"
});

Object.defineProperty(JSGO.OPERATOR, "MT", {
	enumerable: true,
	configurable: false,
	writable: false,
	value: "mt"
});

Object.defineProperty(JSGO.OPERATOR, "MTE", {
	enumerable: true,
	configurable: false,
	writable: false,
	value: "mte"
});

Object.defineProperty(JSGO.OPERATOR, "LIKE", {
	enumerable: true,
	configurable: false,
	writable: false,
	value: "like"
});

Object.defineProperty(JSGO.OPERATOR, "HAS", {
    enumerable: true,
    configurable: false,
    writable: false,
    value: "has"
});

/*
 * Query methods used into Query Object
 */
Object.defineProperty(JSGO.METHOD, "SELECT", {
	enumerable: true,
	configurable: false,
	writable: false,
	value: "SELECT"
});

Object.defineProperty(JSGO.METHOD, "UPDATE", {
	enumerable: true,
	configurable: false,
	writable: false,
	value: "UPDATE"
});

Object.defineProperty(JSGO.METHOD, "DELETE", {
	enumerable: true,
	configurable: false,
	writable: false,
	value: "DELETE"
});

/*
 * Order type to use in Query object
 */
Object.defineProperty(JSGO.ORDER, "ASC", {
	enumerable: true,
	configurable: false,
	writable: false,
	value: "asc"
});

Object.defineProperty(JSGO.ORDER, "DESC", {
	enumerable: true,
	configurable: false,
	writable: false,
	value: "desc"
});


/*
 * Pre defined filters of common use
 */
Object.defineProperty(JSGO.FILTER, "ALL", {
	enumerable: true,
	configurable: false,
	writable: false,
	value: "filter-all"
});
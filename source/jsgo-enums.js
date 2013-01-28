/**
 * Contains enumerations used into the jsgo
 * @enum
 */
JSGO = new Object();

Object.defineProperty(JSGO, "OPERATOR", {
  enumerable: true,
  configurable: false,
  writable: false,
  value: {}
});

/*
 * Logic operators used in Filter object
 */

    Object.defineProperty(JSGO.OPERATOR, "EQ", {
      enumerable: true,
      configurable: false,
      writable: false,
      value: "eq"
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

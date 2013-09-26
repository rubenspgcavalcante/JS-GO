/**
 * Creates a filter to apply into the query
 * @param {String} attribute
 * @param {Number} operator (Use the {@link{GO.Query.op}} enum
 * @param {*} value
 * @constructor
 */
GO.Query.Filter = function(attribute, operator, value){
    this.attribute = attribute;
    this.operator = operator;
    this.value = value;

    /** @type {GO.Query.Filter}*/
    var parent = null;

    /** @type {Object<GO.Query.Filter>}*/
    var _chainFilters = {
        and: null,
        or: null,
        xor: null
    };

    /**
     * Creates a chain filter, based on the giving operation, returning it
     * @param {String} logicOp
     * @param {String} attribute
     * @param {Number} operator
     * @param {*} value
     * @returns {GO.Query.Filter}
     * @private
     */
    var _createChainFilter = function(logicOp, attribute, operator, value){
        for(var key in _chainFilters){
            if(key == logicOp){
                _chainFilters[i] = new GO.Query.Filter(attribute, operator, value);
                _chainFilters[i]._setParent(this);
            }
            else{
                _chainFilters[i] = null;
            }
        }
        return _chainFilters[logicOp];
    };

    /**
     * Sets a parent filter to this filter
     * @param {GO.Query.Filter} filter
     * @private
     */
    this._setParent = function(filter){
        parent = filter;
    };

    /**
     * Gets this filter parent
     * @returns {?GO.Query.Filter}
     */
    this.parent = function(){
        return parent;
    };

    /**
     * Gets this filter child
     * @returns {?GO.Query.Filter}
     */
    this.child = function(){
        return _chainFilters.and || _chainFilters.or || _chainFilters.xor;
    };

    /**
     * Gets to the root filter
     * @returns {?GO.Query.Filter}
     */
    this.root = function(){
        var root = null;
        while(this.parent() != null){
            root = this.parent();
        }
        return root;
    };

    /**
     * Verify if the filter is empty
     * @return {Boolean}
     */
    this.isEmpty = function(){
        return typeof this.attribute == null &&
               typeof this.operator == null &&
               typeof this.value == null;
    };

    /**
     * Chains a or filter
     * @param {String} attribute
     * @param {Number} operator (Use the {@link{GO.Query.op}} enum
     * @param {*} value
     * @returns {GO.Query.Filter}
     */
    this.and = function(attribute, operator, value){
        return _createChainFilter("and", attribute, operator, value);
    };

    /**
     * Chains a or filter
     * @param {String} attribute
     * @param {Number} operator (Use the {@link{GO.Query.op}} enum
     * @param {*} value
     * @returns {GO.Query.Filter}
     */
    this.or = function(attribute, operator, value){
        return _createChainFilter("or", attribute, operator, value);
    };

    /**
     * Chains a or filter
     * @param {String} attribute
     * @param {Number} operator (Use the {@link{GO.Query.op}} enum
     * @param {*} value
     * @returns {GO.Query.Filter}
     */
    this.xor = function(attribute, operator, value){
        return _createChainFilter("xor", attribute, operator, value);
    };
};

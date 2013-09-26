/**
 * Do the dirty work. Process the query based
 * on his record of operations and filters.
 *
 * @param {GO.Query} query
 * @param {GO.Query.Filter} queryFilter
 * @private
 */
GO.Query._Processor = function(query, queryFilter){
    var _query = query;
    var _filter = queryFilter;

    //==================================================//
    //				    Private methods					//
    //==================================================//
    /**
     * Applies the given filter, and verify if the value
     * has passed on the filter
     * @param {*} value
     * @param {GO.Query.Filter} filter
     * @returns {Boolean}
     * @throws {Error}
     * @private
     */
    var _applyFilter = function(value, filter){
        var approved = false;
        switch (filter.operator){
            case GO.query.op.EQ:
                if(value == filter.value){
                    approved = true;
                }
                break;

            case GO.query.op.NEQ:
                if(value != filter.value){
                    approved = true;
                }
                break;

            case GO.query.op.GTE:
                if(value >= filter.value){
                    approved = true;
                }
                break;

            case GO.query.op.MTE:
                if(value <= filter.value){
                    approved = true;
                }
                break;

            case GO.query.op.GT:
                if(value > filter.value){
                    approved = true;
                }
                break;

            case GO.query.op.MT:
                if(value < filter.value){
                    approved = true;
                }
                break;

            case GO.query.op.LIKE:
                if(filter.value instanceof RegExp){
                    if(filter.value.test(value)){
                        approved = true;
                    }
                }
                break;

            case GO.query.op.HAS:
                if(value instanceof Array){
                    for(var i in attributeValue){
                        if(filter.value == value[i]){
                            approved = true;
                            break;
                        }
                    }
                }
                break;

            case GO.query.op.TAUTOLOGICAL:
                approved = true;
                break;

            case GO.query.op.CONTRADICTORY:
                approved = false;
                break;

            default:
                throw Error("Operator " + filter.operator + " doesn't exists");
        }

        if(approved){
            if(filter.child() != null){
                return _applyFilter(value, filter.child());
            }
        }

        return false;
    };

    /**
     * Search the attribute value in inner objects
     * @return {*}
     * @private
     */
    var _deepSearchAttribute = function(obj, attribute){
        var i = attribute.indexOf('.');
        var innerObjectName = attribute.slice(0,i);
        attribute = attribute.slice(i+1);

        if(typeof obj[innerObjectName] == "undefined"){
            throw Error("Object has no attribute " + attribute);
        }

        var innerObject = obj[innerObjectName];

        //Exists other points? e.g. customer.creditcard.brand
        if(attribute.indexOf('.') != -1 && innerObject != null){
            return _deepSearchAttribute(innerObject, attribute);
        }
        else if(innerObject != null){
            return innerObject[attribute];
        }

        return null;
    };

    //==================================================//
    //				    Public methods					//
    //==================================================//
    /**
     * Executes the query
     * returning the processed array
     * @return {Object[]}
     */
    this.run = function(){

        return [];
    };
};

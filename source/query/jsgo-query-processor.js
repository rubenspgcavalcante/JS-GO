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
     * Search the attribute value in inner objects
     * @return {*}
     * @private
     */
    var _deepSearchAttribute = function(obj, attribute){
        var index = attribute.indexOf('.');
        var innerObjectName = attribute.slice(0,i);
        if(index != -1){
            attribute = attribute.slice(index + 1);
        }

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

    /**
     * Applies the given filter, and verify if the value
     * has passed on the filter
     * @param {Object} obj
     * @param {GO.Query.Filter} filter
     * @returns {Boolean}
     * @throws {Error}
     * @private
     */
    var _applyFilter = function(obj, filter){
        var approved = false;
        var value = _deepSearchAttribute(obj, filter.attribute);

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
                return _applyFilter(obj, filter.child());
            }
        }

        return false;
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
        var result = [];
        for(var i in _query.collection){
            var currentObj = _query.collection[i];
            if(currentObj instanceof _query._getRecord().from){
                if(_applyFilter(currentObj, _query._getRecord().where.filter)){
                    result.push(currentObj);
                }
            }
        }

        return result;
    };
};

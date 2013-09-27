/**
 * Do the dirty work. Process the query based
 * on his record of operations and filters.
 *
 * @param {GO.Query} query
 * @private
 */
GO.Query._Processor = function(query){
    var _query = query;

    //==================================================//
    //				    Private methods					//
    //==================================================//

    /**
     * Search the attribute value in inner objects
     * and return/set the value
     * @param {Object} obj
     * @param {String} attribute
     * @param {*} [operation={GO.query.type.SELECT}]
     * @param {*} [updateVal] Used if the operation is update
     * @return {?*}
     * @private
     */
    var _deepAttribute = function(obj, attribute, operation, updateVal){
        var index = attribute.indexOf('.');
        var value = null;
        operation = operation || GO.query.type.SELECT;

        if(index != -1){
            var upperKey = attribute.slice(0, index);
            attribute = attribute.slice(index + 1);
            value = obj[upperKey] || null;
        }
        else{
            value = obj[attribute] || null;
        }

        //Exists other points? e.g. customer.creditcard.brand
        if(attribute.indexOf('.') != -1 && value != null){
            return _deepSearchAttribute(value, attribute);
        }

        else{
            switch(operation){
                case GO.query.type.SELECT:
                    return value;

                case GO.query.type.UPDATE:
                    obj[attribute] = updateVal;
                    break;

                case GO.query.type.DELETE:
                    delete obj[attribute];
                    break;
            }
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
        var value = _deepAttribute(obj, filter.attribute);

        switch (filter.operator){
            case GO.op.EQ:
                if(value == filter.value){
                    approved = true;
                }
                break;
            case GO.op.NEQ:
                if(value != filter.value){
                    approved = true;
                }
                break;

            case GO.op.GTE:
                if(value >= filter.value){
                    approved = true;
                }
                break;

            case GO.op.MTE:
                if(value <= filter.value){
                    approved = true;
                }
                break;

            case GO.op.GT:
                if(value > filter.value){
                    approved = true;
                }
                break;

            case GO.op.MT:
                if(value < filter.value){
                    approved = true;
                }
                break;

            case GO.op.LIKE:
                if(filter.value instanceof RegExp){
                    if(filter.value.test(value)){
                        approved = true;
                    }
                }
                break;

            case GO.op.HAS:
                if(value instanceof Array){
                    for(var i in value){
                        if(filter.value == value[i]){
                            approved = true;
                            break;
                        }
                    }
                }
                break;

            case GO.op.TAUTOLOGICAL:
                approved = true;
                break;

            case GO.op.CONTRADICTORY:
                approved = false;
                break;

            default:
                throw Error("Operator " + filter.operator + " doesn't exists");
        }

        if(approved){
            if(filter.child() != null){
                return _applyFilter(obj, filter.child());
            }
            return true;
        }
        return false;
    };

    /**
     * Apply the user selection to the collection
     * Can get inner attributes too, e.g.: user.vehicle.brand
     * @param {Object} obj
     * @param {String} attr
     * @return {Object}
     * @private
     */
    var _selectInObject = function(obj, attr){
        var copy = {};
        var index = attr.indexOf(".");

        if(attr == GO.query.WILDCARD){
            copy = JSON.parse(JSON.stringify(obj));
        }

        else if(index == -1){
            if(typeof obj[attr] == "object"){
                copy[attr] = JSON.parse(JSON.stringify(obj[attr]));
            }
            else{
                copy[attr] = obj[attr];
            }
        }

        else{
            var upperKey = attr.slice(0, index);
            attr = attr.slice(index + 1);
            copy[upperKey] = obj[upperKey] || null;

            if(attr.indexOf(".") != -1){
                copy[upperKey] = _selectInObject(copy[upperKey], attr);
            }
            else if(typeof copy[upperKey] == "object"){
                copy = JSON.parse(JSON.stringify(copy));
            }
        }
        return copy;
    };

    /**
     * Merges two objects
     * @param {Object} obj1
     * @param {Object} obj2
     * @private
     */
    var _merge = function(obj1, obj2){
        for(var i in obj2){
            if(obj2.hasOwnProperty(i)){
                obj1[i] = obj2[i];
            }
        }
    };

    /**
     * Applies the selection to the result filtered collection
     * @param values
     * @returns {Object[]}
     * @private
     */
    var _applySelection = function(values){
        var results = [];
        var attributes = _query._getRecord().selection;
        if(attributes.length == 0){
            attributes = [GO.query.WILDCARD];
        }

        for(var i in values){
            var copy = {};
            for(var j in attributes){
                _merge(copy, _selectInObject(values[i], attributes[j]));
            }
            results.push(copy);
        }

        return results;
    };

    /**
     * Verify if the collection values pass in the filter
     * and if does, execute a callback passing the value
     * @param {Function} callback
     * @private
     */
    var _processFilter = function(callback){
        for(var i in _query.collection){
            var currentObj = _query.collection[i];
            if(currentObj instanceof _query._getRecord().from){
                if(_applyFilter(currentObj, _query._getRecord().where.filter)){
                    callback(currentObj);
                }
            }
        }
    };

    /**
     * Executes a Select operation into the collection
     * @returns {Object[]}
     * @private
     */
    var _execSelect = function(){
        var results = [];
        _processFilter(function(currentObj){
            results.push(currentObj);
        });

        return _applySelection(results);
    };

    /**
     * Executes a Update operation into the collection
     * @private
     */
    var _execUpdate = function(){
        _processFilter(function(currentObj){
            var selections = _query._getRecord().selection;
            var updateVals = _query._getRecord().updateTo;

            for(var i in selections){
                _deepAttribute(currentObj, selections[i], GO.query.type.UPDATE, updateVals[i]);
            }
        });
    };

    /**
     * Executes a Delete operation into the collection
     * @private
     */
    var _execDelete = function(){
        _processFilter(function(currentObj){
            var selections = _query._getRecord().selection;
            for(var i in selections){
                _deepAttribute(currentObj, selections[i], GO.query.type.DELETE);
            }
        });
    };

    //==================================================//
    //				    Public methods					//
    //==================================================//
    /**
     * Executes the query
     * returning the processed array
     * @return {*}
     */
    this.run = function(){
        switch(_query._getRecord().type){
            case GO.query.type.SELECT:
                return _execSelect();

            case GO.query.type.UPDATE:
                return _execUpdate();

            case  GO.query.type.DELETE:
                return _execDelete();

            default:
                return null;
        }
    };
};

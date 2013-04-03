/**
 * A filter tree, where can be carried with other filter using the methods OR and
 * AND. To finish the carry and come back to this root filter use the method END
 * 
 * @constructor
 * @param {string} attribute Atribute to look and compare
 * @param {string} operator The operator used
 * @param value The value to search and compare using the operator
 * @param {object} _parent Used only by the methods AND and OR
 * @return {Object} Filter
 */
GenericObjectCollection.Filter = function(attribute, operator, value, _parent){

    this.attribute = attribute;
    this.operator = operator;
    this.value = value;

    this.parent = typeof(_parent) == "undefined" ? null : _parent;
    this.or = null;
    this.and = null;
    this.xor = null;

    return this;

};

/**
 * Constructor to return  pre-defined filters
 * 
 * @param {string} preDefinedFilter The name of the pre-defined filter. Please use the JSGO.FILTER enum
 * @param {string} attribute The attribute to use in filter constructor
 * @param {value} the value to use in filter constructor
 */
GenericObjectCollection.Filter.PreDefined = function(preDefinedFilter, attribute, value){
	if(preDefinedFilter == JSGO.FILTER.ALL){
		return GenericObjectCollection.Filter(attribute, JSGO.OPERATOR.LIKE, /\d*/);
	}
};

/**
 * Method to carry to others filters using the OR logic
 * 
 * @param {string} attribute Atribute to look and compare
 * @param {string} operator The operator used
 * @param value The value to search and compare using the operator
 * @return {Object} Filter
 */
GenericObjectCollection.Filter.prototype.OR = function(attribute, operator, value){
    this.or = new GenericObjectCollection.Filter(attribute, operator, value, this);
    this.and = null;
    this.xor = null;
    return this.or;
};


/**
 * Method to carry to others filters using the AND logic
 * 
 * @param {string} attribute Atribute to look and compare
 * @param {string} operator The operator used. Use the enum JSGO.OPERATOR
 * @param value The value to search and compare using the operator
 * @return {Object} Filter
 */
GenericObjectCollection.Filter.prototype.AND = function(attribute, operator, value){
    this.and = new GenericObjectCollection.Filter(attribute, operator, value, this);
    this.or = null;
    this.xor = null;
    return this.and;
};

/**
 * Method to carry to others filters using the XOR logic
 * 
 * @param {string} attribute Atribute to look and compare
 * @param {string} operator The operator used. Use the enum JSGO.OPERATOR
 * @param value The value to search and compare using the operator
 * @return {Object} Filter
 */
GenericObjectCollection.Filter.prototype.XOR = function(attribute, operator, value){
    this.xor = new GenericObjectCollection.Filter(attribute, operator, value, this);
    this.and = null;
    this.or = null;
    return this.xor;
};


/**
 * Finish the filter carry and returns to the root filter
 *
 *  @return {Object} Root filter
 */
GenericObjectCollection.Filter.prototype.toRoot = function(){
    var root = this;
    while(root.parent != null){
        root = root.parent;
    }
    return root;
};

/**
 * Recursive method to process the filter and the child filters 
 * (OR or AND) returning if the value pass or not.
 *
 * @param {Object} genericObject The object used to compare based on filter
 * @return {boolean} If the value pass on the test filters
 */
GenericObjectCollection.Filter.prototype.process = function(objectParam){
    
	var flag = false;
    var filter = this;
    var attributeValue = null;
	
    if(filter.operator == JSGO.OPERATOR.TAUTOLOGICAL){
		return true;
    }
    else if(filter.operator == JSGO.OPERATOR.CONTRADICTORY){
		return false;
    }

    if(filter.attribute.indexOf(".") != -1){
        attributeValue = GenericObjectCollection.Query.deepSearch(filter.attribute, objectParam);
    }
    
    else if(objectParam instanceof GenericObject){
    	if(typeof(objectParam[filter.attribute]) != "undefined"){
    		attributeValue = objectParam[filter.attribute].get();
    	}
    	else{
    		throw Error(filter.attribute + " is not a attribute of " + objectParam.header.className);
    	}
    }
    
    else{
    	attributeValue = objectParam[filter.attribute];
    }

    switch (filter.operator){

        case JSGO.OPERATOR.EQ:
            if(attributeValue == filter.value){
                flag = true;
            }
            break;

        case JSGO.OPERATOR.GTE:
            if(attributeValue >= filter.value){
                flag = true;
            }
            break;

        case JSGO.OPERATOR.MTE:
            if(attributeValue <= filter.value){
                flag = true;
            }
            break;

        case JSGO.OPERATOR.GT:
            if(attributeValue > filter.value){
                flag = true;
            }
            break;

        case JSGO.OPERATOR.MT:
            if(attributeValue < filter.value){
                flag = true;
            }
            break;

        case JSGO.OPERATOR.LIKE:
            if(filter.value instanceof RegExp){
                if(filter.value.test(attributeValue)){
                    flag = true;
                }
            }
            break;

        default:
            throw Error("Operator "+filter.operator+" doesn't exists");
    }

    //Check if only one filter is used
    if( (filter.or != null) + (filter.and != null) + (filter.xor != null) > 1){
        throw Error("Filter using more than one logic conector.");
    }

    if(filter.or != null){
        return flag || filter.or.process(objectParam);
    }

    else if(filter.and != null){
        return flag && filter.and.process(objectParam);
    }

    else if(filter.xor != null){
        var secflag = filter.xor.process(objectParam);
        return (flag && !secflag) || (!flag && secflag);
    }

    //End of recursion
    return flag;
};
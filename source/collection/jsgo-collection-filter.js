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
    this.or = null
    this.and = null;

    return this;

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
    return this.and;
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

/*
 * Recursive method to process the filter and the child filters 
 * (OR or AND) returning if the value pass or not.
 *
 * @param {Object} genericObject The object used to compare based on filter
 * @return {boolean} If the value pass on the test filters
 */
GenericObjectCollection.Filter.prototype.process = function(genericObject){
    var flag = false;
    var filter = this;
    switch (filter.operator){
        case JSGO.OPERATOR.EQ:
            if(genericObject[filter.attribute].get() == filter.value){
                flag = true;
            }
            break;

        case JSGO.OPERATOR.GTE:
            if(genericObject[filter.attribute].get() >= filter.value){
                flag = true;
            }
            break;

        case JSGO.OPERATOR.MTE:
            if(genericObject[filter.attribute].get() <= filter.value){
                flag = true;
            }
            break;

        case JSGO.OPERATOR.GT:
            if(genericObject[filter.attribute].get() > filter.value){
                flag = true;
            }
            break;

        case JSGO.OPERATOR.MT:
            if(genericObject[filter.attribute].get() < filter.value){
                flag = true;
            }
            break;

        default:
            throw Error("Operator "+filter.operator+" doesn't exists");
    }

    if(filter.or != null){
        return flag || filter.or.process(genericObject);
    }

    else if(filter.and != null){
        return flag && filter.and.process(genericObject);
    }

    //End of recursion
    return flag;
};
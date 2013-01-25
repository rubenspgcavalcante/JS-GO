GenericObjectCollection.Query = function(collection){
    this.collection = collection;
    this.lastQuery = null;
    this.query = {
        select: null,
        from: null,
        where: null
    };
};

/**
 * A filter tree, where can be carried with other filter using the methods OR and
 * AND. To finish the carry and come back to this root filter use the method END
 * 
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
}


/**
 * Method to carry to others filters using the AND logic
 * 
 * @param {string} attribute Atribute to look and compare
 * @param {string} operator The operator used
 * @param value The value to search and compare using the operator
 * @return {Object} Filter
 */
GenericObjectCollection.Filter.prototype.AND = function(attribute, operator, value){
    this.and = new GenericObjectCollection.Filter(attribute, operator, value, this);
    return this.and;
}


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
}


GenericObjectCollection.Query.prototype.Select = function(attributes){

    if(Array.isArray(attributes)){
        this.query.select = attributes;
    }

    else{
        var args = arguments;
        this.query.select = [];
        for(i in args){
            this.query.select.push(args[i]);
        }
    }

    var that = this;
    var recordSelect = {};

    var selectedAttributes = function(object){
        var result = {};
        var attributes = that.query.select;
        for(i in attributes){
            if(typeof(attributes[i]) != "undefined"){
                result[attributes[i]] = object[attributes[i]].get();
            }
            else{
                result[attributes[i]] = null;
            }
        }

        return result;
    };

    recordSelect.From = function(className){
        var recordFrom = {};
        that.query.from = className;
        
        recordFrom.Where = function(filter){
            //Get the root filter
            filter = filter.toRoot();

            var recordWhere = {};
            that.query.where = {
                attribute: filter.attribute,
                operator: filter.operator,
                value: filter.value
            };

            recordWhere.run = function(){
                var response = [];
                var list = that.collection.objects;

                /*
                 * Recursive method to process the filter and the child filters 
                 * (OR or AND) returning if the value pass or not.
                 *
                 * @param {Object} genericObject The object used to compare based on filter
                 * @param {Object} filter The object filter
                 * @return {boolean} If the value passed on the filters
                 */
                var processFilter = function(genericObject, filter){
                    var flag = false;

                    switch (filter.operator){
                        case "eq":
                            if(genericObject[filter.attribute].get() == filter.value){
                                flag = true;
                            }
                            break;

                        case "gte":
                            if(genericObject[filter.attribute].get() >= filter.value){
                                flag = true;
                            }
                            break;

                        case "mte":
                            if(genericObject[filter.attribute].get() <= filter.value){
                                flag = true;
                            }
                            break;

                        case "gt":
                            if(genericObject[filter.attribute].get() > filter.value){
                                flag = true;
                            }
                            break;

                        case "mt":
                            if(genericObject[filter.attribute].get() < filter.value){
                                flag = true;
                            }
                            break;
                    }

                    if(filter.or != null){
                        return flag || processFilter(genericObject, filter.or);
                    }

                    else if(filter.and != null){
                        return flag && processFilter(genericObject, filter.and);
                    }

                    //End of recursion
                    return flag;
                    
                };

                for (i in list){
                    if(list[i].header.className == className){
                        if(processFilter(list[i], filter)){

                            response.push(selectedAttributes(list[i]));

                        }
                    }
                }
                return response;
            }
            return recordWhere;
        }
        return recordFrom;
    };
    return recordSelect;
};

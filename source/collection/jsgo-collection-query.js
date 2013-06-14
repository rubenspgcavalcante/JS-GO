
/**
* Object query, do a query into a GenericObjectCollection
*
* @constructor
* @param {Object} collection The collection where do the query
*/
GenericObjectCollection.Query = function(collection){
    var that = this;
    this.collection = collection;
    this.lastQuery = null;
    this.query = {
        type: null, //Can be SELECT, UPDATE, DELETE
        selection: null,
        from: null,
        where: null,
        updateTo: [],
        orderby: null
    };

    /**
     * The from function used by the Select and Delete methods
     *
     * @param {string} className The class type of object to analyse
     */
    this.fromFunc = function(className){
        var recordFrom = {};
        that.query.from = className;
        
        recordFrom.Where = function(filter){
        	/*
        	 * If the user pass the JSGO.FILTER.ALL
        	 */
        	if(filter == JSGO.FILTER.ALL){
        		filter = new GenericObjectCollection.Filter(null, JSGO.OPERATOR.TAUTOLOGICAL, null);
        	}
        	
            //Get the root filter
            filter = filter.toRoot();

            var recordWhere = {};
            that.query.where = {
                attribute: filter.attribute,
                operator: filter.operator,
                value: filter.value
            };

            var run = function(){
            	var response = false;
                if(that.query.type == JSGO.METHOD.SELECT){
                    response = [];
                }
                
                var list = [];
                if(that.collection instanceof GenericObjectCollection){
                	list = that.collection.objects.slice();
                }
                
                else{
                	list = that.collection.slice();
                }

                /*
                 We need a counter, because when removes a object the index of all who are
                 after will be altered, so the counter maintain this.
                */
                var cnt = 0;

                for (i in list){
                    if((typeof(className) != "string" && list instanceof className) || className == "*" || list[i].header.className == className){

                        //If the object matches the filters do a (SELECT, DELETE, UPDATE)
                        if(filter.process(list[i])){
                            switch(that.query.type){
                                case JSGO.METHOD.SELECT:
                                    response.push(that.selectedAttributes(list[i]));
                                    break;

                                case JSGO.METHOD.UPDATE:
                                    var attributes = that.query.selection;
                                    var flag = that.__whenUpdate(attributes, i);  
                                    response = response ? true : flag;
                                    break;

                                case JSGO.METHOD.DELETE:
                                    that.collection.objects.splice(cnt, 1);
                                    cnt--;
                                    response = true;
                                    break;

                                default:
                                    throw Error("Query type doesn't exist. Use the JSGO.METHOD enum");
                            }
                        }
                        cnt++;
                    }
                }

                if(that.orderby != null){
                    that.__whenOrderBy(response, that.orderby.attribute, that.orderby.order);
                }
                return response;
            };

            /*
             The method UPDATE, must not return the object containing the run method.
             Him must return a method Set and the set return the method run.
            */
            if(that.query.type == JSGO.METHOD.UPDATE){
                recordWhere.Set = function(){
                    var recordSet = {};
                    that.query.updateTo = arguments;
                    recordSet.run = run;

                    return recordSet;
                };
                return recordWhere;
            }

            /*
             A SELECT contains the option of order by too
            */
            if(that.query.type == JSGO.METHOD.SELECT){
                recordWhere.OrderBy = function(attribute, order){
                    var recordOrderBy = {};
                    that.orderby = {attribute: attribute, order: order};
                    recordOrderBy.run = run;

                    return recordOrderBy;
                };
            }

            recordWhere.run = run;
            return recordWhere;
        };
        return recordFrom;
    };
};

/**
 * If attribute is a object, search recursively inner it, 
 * e.g.: customer.car.plate
 *
 * @static
 * @param {string} attribute The attribute to search into the object, connected by dots
 * @param {GenericObject | Object} The object to search into
 * @returns The value searched
 */
GenericObjectCollection.Query.deepSearch = function(attribute, object){
    var i = attribute.indexOf('.');
    var innerObjectName = attribute.slice(0,i);
    var innerObject = null;
    attribute = attribute.slice(i+1);

    if(typeof(object[innerObjectName]) == "undefined"){
        return null;
    }

    if(object instanceof GenericObject){
        innerObject = object[innerObjectName].get();
    }
    else{
        innerObject = object[innerObjectName];
    }

    //Exists other points? e.g. customer.creditcard.brand
    if(attribute.indexOf('.') != -1 && innerObject != null){
            return GenericObjectCollection.Query.deepSearch(attribute, innerObject);
    }

    else if(innerObject != null){
        if(innerObject instanceof GenericObject)
            return innerObject[attribute].get();
        else{
            return innerObject[attribute];
        }
    }

    return null;
};
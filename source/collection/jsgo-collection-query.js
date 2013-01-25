
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
        matches: null,
        from: null,
        where: null
    };

    /*
     * The from function used by the Select and Delete methods
     *
     * @param {string} className The class type of object to analyse
     */
    this.fromFunc = function(className){
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
                if(that.query.type == "SELECT"){
                    var response = [];
                }

                else{
                    var response = false;
                }
                
                var list = that.collection.objects.slice();

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

                /*
                 We need a counter, because when removes a object the index of all who are
                 after will be altered, so the counter maintain this.
                */
                var cnt = 0;

                for (i in list){
                    if(list[i].header.className == className){

                        //If the object matches the filters do a (SELECT, DELETE, UPDATE)
                        if(processFilter(list[i], filter)){
                            switch(that.query.type){
                                case "SELECT":
                                    response.push(that.selectedAttributes(list[i]));
                                    break;

                                case "UPDATE":
                                    //TODO: update method
                                    break;

                                case "DELETE":
                                    that.collection.objects.splice(cnt, 1);
                                    cnt--;
                                    response = true;
                                    break;

                                default:
                                    throw Error("Query type doesn't exist. Use (SELECT, UPDATE, DELETE)");
                            }
                        }
                        cnt++;
                    }
                }
                return response;
            }
            return recordWhere;
        }
        return recordFrom;
    };
};

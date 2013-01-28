
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
        updateTo: []
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

            var run = function(){
                if(that.query.type == "SELECT"){
                    var response = [];
                }

                else{
                    var response = false;
                }
                
                var list = that.collection.objects.slice();

                /*
                 We need a counter, because when removes a object the index of all who are
                 after will be altered, so the counter maintain this.
                */
                var cnt = 0;

                for (i in list){
                    if(list[i].header.className == className){

                        //If the object matches the filters do a (SELECT, DELETE, UPDATE)
                        if(filter.process(list[i])){
                            switch(that.query.type){
                                case "SELECT":
                                    response.push(that.selectedAttributes(list[i]));
                                    break;

                                case "UPDATE":
                                    var attributes = that.query.selection;
                                    var flag = that.__whenUpdate(attributes, index);  
                                    response = response ? true : flag
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

            /*
             The method Update, must not return the object containing the run method.
             Him must return a method Set and the set return the method run.
            */
            if(that.query.type == "UPDATE"){
                recordWhere.Set = function(){
                    var recordSet = {};
                    that.query.updateTo = arguments;
                    recordSet.run = run;

                    return recordSet;
                };
                return recordWhere
            }

            recordWhere.run = run;
            return recordWhere;
        }
        return recordFrom;
    };
};

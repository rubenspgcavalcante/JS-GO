GenericObjectCollection.Query = function(collection){
    this.collection = collection;
    this.lastQuery = null;
    this.query = {
        select: null,
        from: null,
        where: null
    };
};

GenericObjectCollection.Filter = function(attribute, operator, value){
    this.attribute = attribute;
    this.operator = operator;
    this.value =value;
};

GenericObjectCollection.Query.prototype.Select = function(attributes){
    var that = this;
    var recordSelect = {};
    this.query.select = attributes;

    var selectedAttributes = function(object){
        var result = {};
        for(i in attributes){
            if(typeof(object[attributes[i]]) != "undefined"){
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
            var recordWhere = {};
            that.query.where = {
                attribute: filter.attribute,
                operator: filter.operator,
                value: filter.value
            };

            recordWhere.run = function(){
                var response = [];
                var list = that.collection.objects;
                for (i in list){
                    if(list[i].header.className == className){

                        switch (filter.operator){
                            case "eq":
                                if(list[i][filter.attribute].get() == filter.value){
                                    response.push(selectedAttributes(list[i]));
                                }
                                break;

                            case "gte":
                                if(list[i][filter.attribute].get() >= filter.value){
                                    response.push(selectedAttributes(list[i]));
                                }
                                break;

                            case "mte":
                                if(list[i][filter.attribute].get() <= filter.value){
                                    response.push(selectedAttributes(list[i]));
                                }
                                break;

                            case "gt":
                                if(list[i][filter.attribute].get() > filter.value){
                                    response.push(selectedAttributes(list[i]));
                                }
                                break;

                            case "mt":
                                if(list[i][filter.attribute].get() < filter.value){
                                    response.push(selectedAttributes(list[i]));
                                }
                                break;
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

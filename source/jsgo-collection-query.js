GenericObjectCollection.Query = function(collection){
    this.collection = collection;
    this.lastQuery = null;
    this.query = {
        select: null,
        from: null,
        where: null,
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
            result[i] = object[i];
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
                    if(list[i].header.class == className){
                        
                        if(
                            (filter.operator == "gt" && list[i][filter.attribute] > filter.value) ||

                            (filter.operator == "mt" && list[i][filter.attribute] < filter.value) ||

                            (
                                filter.operator == "mte" ||
                                filter.operator == "gte" ||
                                filter.operator == "eq"
                            ) &&

                            list[i][filter.attribute] == filter.value
                        ){
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

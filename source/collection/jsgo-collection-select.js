GenericObjectCollection.Query.prototype.Select = function(attributes){

    if(Array.isArray(attributes)){
        this.query.selection = attributes;
    }

    else{
        var args = arguments;
        this.query.selection = [];
        for(i in args){
            this.query.selection.push(args[i]);
        }
    }

    var that = this;
    var recordSelect = {};

    this.query.type = "SELECT";
    //Call the From method of the Query object, look in jsgo-collection-query.js
    recordSelect.From = this.fromFunc;

    this.selectedAttributes = function(object){
        var result = {};
        var attributes = that.query.selection;
        for(i in attributes){
            if(attributes[i] == "*"){
                result = object.toObject();
                break;
            }

            if(typeof(attributes[i]) != "undefined"){
                result[attributes[i]] = object[attributes[i]].get();
            }

            else{
                result[attributes[i]] = null;
            }
        }

        return result;
    };
    
    return recordSelect;
};
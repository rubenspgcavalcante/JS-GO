GenericObjectCollection.Query.prototype.Update = function(attributes){
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
    var recordUpdate = {};

    this.query.type = "UPDATE";
    //Call the From method of the Query object, look in jsgo-collection-query.js
    recordUpdate.From = this.fromFunc;
    
    return recordUpdate
};
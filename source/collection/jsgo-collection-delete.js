GenericObjectCollection.Query.prototype.Delete = function(attributes){
    if(Array.isArray(attributes)){
        this.query.matches = attributes;
    }

    else{
        var args = arguments;
        this.query.matches = [];
        for(i in args){
            this.query.matches.push(args[i]);
        }
    }

    var that = this;
    var recordDelete = {};

    this.query.type = "DELETE";
    //Call the From method of the Query object, look in jsgo-collection-query.js
    recordDelete.From = this.fromFunc;
    
    return recordDelete
};
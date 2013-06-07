GenericObjectCollection.Query.prototype.Delete = function(attributes){
    this.query.selection = [];
    
    var recordDelete = {};

    this.query.type = JSGO.METHOD.DELETE;
    //Call the From method of the Query object, look in jsgo-collection-query.js
    recordDelete.From = this.fromFunc;
    
    return recordDelete;
};
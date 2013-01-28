GenericObjectCollection.Query.prototype.Delete = function(attributes){
    this.query.selection = [];
    
    var that = this;
    var recordDelete = {};

    this.query.type = "DELETE";
    //Call the From method of the Query object, look in jsgo-collection-query.js
    recordDelete.From = this.fromFunc;
    
    return recordDelete
};
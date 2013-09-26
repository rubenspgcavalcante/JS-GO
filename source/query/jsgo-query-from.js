/**
 * Do a 'from' into the query collection
 * @param {GO.Query} query
 * @private
 * @constructor
 */
GO.Query._From = function(query){
    var _query = query;

    /**
     * Method from to use in query record
     * @param {?*} instanceType
     * @return {GO.Query._Where}
     */
    this.from = function(instanceType){
        if(typeof instanceType == "undefined"){
            // Generic type of object
            instanceType = Object;
        }
        _query._setRecord("from", instanceType);
        return new GO.Query._Where(_query);
    };
};
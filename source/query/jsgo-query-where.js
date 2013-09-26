/**
 * Controls the where closure into the query
 * Builds itself based on the parent operation (SELECT, UPDATE, DELETE)
 * @param {GO.Query} query
 * @constructor
 */
GO.Query._Where = function(query){
    var _query = query;

    /** @type {GO.Query.Filter}*/
    this.filter = null;
    switch(query._getRecord().type){
        case GO.query.type.SELECT:
            /**
             * Orders the result array
             * @param {String} attr
             * @param {Number} order ({@link{Use GO.query.order}}}
             */
            this.orderBy = function(attr, order){
                query._setRecord("orderby", {attribute: attr, order: order});
            };
            break;

        case GO.query.type.UPDATE:
            /**
             * Registers the set method
             */
            this.set = function(){

            };
            break;

        case GO.query.type.DELETE:
            break;
    }

    /**
     * Where function, apply a filter to the query
     * @param {GO.Query.Filter} filter
     */
    this.where = function(filter){
        this.filter = filter;

    };
};

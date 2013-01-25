/**
 * A filter tree, where can be carried with other filter using the methods OR and
 * AND. To finish the carry and come back to this root filter use the method END
 * 
 * @constructor
 * @param {string} attribute Atribute to look and compare
 * @param {string} operator The operator used
 * @param value The value to search and compare using the operator
 * @param {object} _parent Used only by the methods AND and OR
 * @return {Object} Filter
 */
GenericObjectCollection.Filter = function(attribute, operator, value, _parent){

    this.attribute = attribute;
    this.operator = operator;
    this.value = value;

    this.parent = typeof(_parent) == "undefined" ? null : _parent;
    this.or = null
    this.and = null;

    return this;

};


/**
 * Method to carry to others filters using the OR logic
 * 
 * @param {string} attribute Atribute to look and compare
 * @param {string} operator The operator used
 * @param value The value to search and compare using the operator
 * @return {Object} Filter
 */
GenericObjectCollection.Filter.prototype.OR = function(attribute, operator, value){
    this.or = new GenericObjectCollection.Filter(attribute, operator, value, this);
    return this.or;
};


/**
 * Method to carry to others filters using the AND logic
 * 
 * @param {string} attribute Atribute to look and compare
 * @param {string} operator The operator used
 * @param value The value to search and compare using the operator
 * @return {Object} Filter
 */
GenericObjectCollection.Filter.prototype.AND = function(attribute, operator, value){
    this.and = new GenericObjectCollection.Filter(attribute, operator, value, this);
    return this.and;
};


/**
 * Finish the filter carry and returns to the root filter
 *
 *  @return {Object} Root filter
 */
GenericObjectCollection.Filter.prototype.toRoot = function(){
    var root = this;
    while(root.parent != null){
        root = root.parent;
    }
    return root;
};
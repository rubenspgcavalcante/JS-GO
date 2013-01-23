/** @license JS-GO Javascript Generic Object
 * License: GPLv3 (GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007)
 *          http://www.gnu.org/licenses/gpl-3.0.html
 *
 * Author:  Rubens Pinheiro Gonçalves Cavalcante
 * Email:   rubenspgcavalcante@gmail.com
 */

/**
 * Generates a object with attributes of especif types.
 * If the user tries to set a value in a non attribute or of a
 * diferent type (if defined), generates a error.
 * 
 * @author Rubens Pinheiro Gonçalves Cavalcante
 * @email rubenspgcavalcante@gmail.com
 * @since jan 2013
 * @version 0.1b
 */

 /*
 * Generic Object
 * @constructor
 * @param {Array<object>} attributes containing {name, type} objects and optionally {notNull, useCast}
 * @param {Object} (Optional) child who will extend
 */
GenericObject = function(attributes, child){

    var that = this;
    var _size = 0;
    var types = {};
    var notNulls = {};
    var useCast = {};

    /**
    * The object header, wich contains some information of this object
    * @static
    */
    this.header = {};

    Object.defineProperty(this.header, "GenericObject", {
        value: true,
        writable: false,
        enumerable: true,
        configurable: false
    });


    /* -------------------------------- Object methods ------------------------------- */

    /**
     * Returns the attributes in a simple object
     *
     * @return {object}
     */
    this.toObject = function(){
        var simpleObject = {};
        for(index in attributes){
            var attribute = attributes[index]
            attribute.name = attribute.name.replace(/\ /g, "_");
            var checkValue = typeof(that[attribute.name].value) == "undefined";
            simpleObject[attribute.name] = checkValue ? null : that[attribute.name].value;
        }

        return simpleObject;
    };


    /**
     * Returns the attributes in a json format
     *
     * @return {string}
     */
    this.toJson = function(){
        return JSON.stringify(this.toObject());
    };

    /**
     * Returns the size (count of attributes)
     *
     * @return {number}
     */
    this.size = function(){
        return _size;
    }


    /* ------------------------------ attribute methods ------------------------------ */
    for(i in attributes){
        var attr = attributes[i].name.replace(/\ /g, "_");
        this[attr] = {name:attr, value: null};
        _size++;

        types[attr] = (attributes[i].type == undefined) ? "undefined" : attributes[i].type;
        notNulls[attr] = (attributes[i].notNull == true)? true : false;
        useCast[attr] = (attributes[i].useCast == true)? true : false;

        /**
         * Validates the value passed based on the type of the object
         *
         * @param Any value to validade
         */
        this[attr].validate = function(value){
            var name = this.name;
            var type = GenericObject.typesLibrary[types[name]];

            if(useCast[attr]){
                value = that[name].cast(value);
            }

            if(value == null || value == ""){
                if(notNulls[name]){
                    return {valid: false, error: TypeError(name +" can't be null")};
                }
            }

            else if(typeof(type) != "undefined"){
                if(!type.validate(value)){
                    return {valid:false, error: TypeError(name +" must be a " + types[name])};
                }
            }

            return {valid: true, error: null};

        };

        /**
         * Default casting to a value passed
         *
         * @param value The value to cast
         * @return The value in the correct format
         */
        this[attr].cast = function(value){
            var name = this.name;
            var type = GenericObject.typesLibrary[types[name]];

            if(typeof(type.cast) != "undefined"){
                return type.cast(value);
            }

            else{
                return value;
            }

        };
        
        /**
         * Default setter to attr key of the object
         *
         * @param Value based on the type of this atribute to set
         */
        this[attr].set = function(value){

            if(useCast[attr]){
                value = this.cast(value);            
            }

            var validation = this.validate(value);
            
            if(!validation.valid){
                throw validation.error;
            }
            
            this.value = value;
        };

        /**
         * Default getter to attr key of the object
         *
         * @return The value of this attribute
         */
        this[attr].get = function(){
            return this.value;
        };

        /**
         * Get information about the type of this attribute
         *
         * @return {Object}
         */
        this[attr].info = function(){
            return {type: types[attr], notNull: notNulls[attr], useCast: useCast[attr]};
        }
    }

    //If passed any object, extend it
    if(typeof(child) == "object"){
        for(i in this){
            child[i] = this[i];
        }

        return child;   
    }

    return this;
   
};

/**
 * A static object that contains all the types
 */
GenericObject.typesLibrary = {
    //Native types
    'undefined': {
        validate: function(value){
            return true;
        },
        cast: function(value){
            return value;
        }
    },

    string: {
        validate: function(value){
            return typeof(value) == "string";
        },
        cast: function(value){
            if(typeof(value) == "object"){
                return value.toSource();
            }
            else{
                return String(value);
            }
        }
    },

    number: {
        //Can be used as float to
        validate: function(value){
            return typeof(value) == "number";
        },
        cast: function(value){
            return Number(value);
        }
    },

    'function': {
        validate: function(value){
            return typeof(value) == "function";
        }
    },

    object: {
        validate: function(value){
            return typeof(value) == "object";
        }
    },

    //Custom types
    integer: {
        validate: function(value){
            return typeof(value) == "number" && /^[+-]?[0-9]+$/.test(value);
        },
        cast: function(value){
            return Number(value);
        }
    },

    positive: {
        validate: function(value){
            return typeof(value) == "number" && value >= 0;
        },
        cast: function(value){
            return Number(value);
        }
    },

    negative: {
        validate: function(value){
            return typeof(value) == "number" && value <= 0;
        },
        cast: function(value){
            return Number(value);
        }
    },

    email:{
        validate: function(value){
            return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
        }
    },

    phone:{
        validate: function(value){
            return /^(\+[0-9]{2})?[0-9]{3}[0-9]*$/.test(value);
        }
    }
};

/**
 * Add to the types library a new type so the
 * user can customise this basic object
 *
 * @param {string} type The name of the new type
 * @param {function} validation The function to validade the new type,
 *        must have one parameter (the value to validade) and return a boolean
 * @param {function} cast (Optional) A function to be a default caster
 */
GenericObject.newType = function(type, validation, cast){
    if(typeof(type) == "undefined" || type == null){
        throw TypeError("First parameter must contain a string representing the name of the type");
    }

    else if(typeof(validation) != "function" || validation == null){
        throw TypeError("The second parameter must contain a function");
    }

    else if(typeof(cast) != "undefined" && typeof(cast) != "function"){
        throw TypeError("The third parameter must contain a function");
    }

    else if(typeof(validation("test")) != "boolean"){
        throw Error("The validation function must return boolean");
    }

    this.typesLibrary[type] = {validate: validation};
}


/**
 * Return a list of all types registered
 *
 * @return {Object} return a list of types
 */
GenericObject.types = function(){
    var res = [];
    for(i in types = this.typesLibrary){
        res.push(i);
    }
    return res;
}
/**
 * A collection ready to contain only generic objects childs
 *
 * @author Rubens Pinheiro Gonçalves Cavalcante
 * @email rubenspgcavalcante@gmail.com
 * @since jan 2013
 * @version 0.1b
 *
 */
 
/*
 * A collection of GenericObjects childs
 * @constructor
 */
GenericObjectCollection = function(){
    this.objects = [];
};


GenericObjectCollection.prototype.add = function(object){
    if(object.header.GenericObject){
        this.objects.push(object);
    }
};


/**
 * Private method to search object(s) into collection
 * @private
 * @param {string} attr The attribute where search
 * @param value to search
 * @param {boolean} unique If unique is true, stops in the first match
 * @return {Object|Array<Object>} The indexes and objects founds
 *
 */
GenericObjectCollection.prototype._find = function(attr, value, unique){
    var response = [];
    for(index in this.objects){
        if(typeof(this.objects[index][attr]) != "undefined" && this.objects[index][attr].get() == value){
            var match = {index: index, object: this.objects[index]};

            if(unique){
                return match;
            }
            else{
                response.push(match);
            }
        }
    }
    if(response.length == 0){
        return null;
    }
    else{
        return response;
    }
};


/**
 * Find objects
 * 
 * @param {string} attr Atribute name do search into objects
 * @param value The value to search
 * @return {Array<Object>} The objects matches
 */
GenericObjectCollection.prototype.find = function(attr, value){
    var result = this._find(attr, value, false)
    var objects = [];

    for(i in result){
        objects.push(result[i].object);
    }

    return objects;
};


/**
 * Find a object
 * 
 * @param {string} attr Atribute name do search into objects
 * @param value The value to search
 * @return {Object} The first object that matches
 */
GenericObjectCollection.prototype.findUnique = function(attr, value){
    var response = this._find(attr, value, true);
    return (response == null)? null : response.object;
};


/**
 * As the findUnique method, but returns the index of the first object that matches
 * 
 * @param {string} attr Atribute name do search into objects
 * @param value The value to search
 * @return {number} The index of the object or -1 if not found
 */
GenericObjectCollection.prototype.indexesOf = function(attr, value){
        var result = this._find(attr, value, false)
    var indexes = [];

    for(i in result){
        indexes.push(result[i].index);
    }

    return indexes;
};


/**
 * As the findUnique method, but returns the index of the first object that matches
 * 
 * @param {string} attr Atribute name do search into objects
 * @param value The value to search
 * @return {number} The index of the object or -1 if not found
 */
GenericObjectCollection.prototype.indexOf = function(attr, value){
    var result = this._find(attr, value, true).index;
    if(result != null){
        return result;
    }
    else{
        return -1;
    }
};
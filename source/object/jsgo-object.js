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
 * @param {string} className A string to indentify the class of objects from this type
 * @param {Array<object>} attributes containing {name, type} objects and optionally {notNull, useCast}
 * @param {Object} (Optional) child who will extend
 */
GenericObject = function(className, attributes, child){

    var that = this;
    var _size = 0;

    // Where the attributes types will be stored
    var types = {};

    // Where the not null flags will be stored
    var notNulls = {};

    // Where the use cast flags will be stored
    var useCast = {};

    // -------------------------- Building Header -------------------------//
    /**
    * The object header, wich contains some information of this object
    * @static
    */
    this.header = {};

    var format = {};
    for(i in attributes){
        var name = attributes[i].name.replace(/\ /g, "_");

        format[name] = {
            type: attributes[i].type,
            notNull: attributes[i].notNull,
            useCast: attributes[i].useCast
        };
    }

    Object.defineProperty(this.header, "format", {
        value: format,
        writable: false,
        enumerable: true,
        configurable: false
    });


    Object.defineProperty(this.header, "GenericObject", {
        value: true,
        writable: false,
        enumerable: true,
        configurable: false
    });

    Object.defineProperty(this.header, "className", {
        value: className,
        writable: false,
        enumerable: true,
        configurable: false
    });
    // ------------------------ End Building Header ------------------------//


    /**
     * Returns the size (count of attributes)
     *
     * @return {number}
     */
    this.size = function(){
        return _size;
    };


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
 * Returns the attributes in a simple object
 *
 * @param {function} callback A function to process each attribute
 */
GenericObject.prototype.each = function(callback){
    var simpleObject = this.toObject();
    for(index in simpleObject){
        callback(index, simpleObject[index]);
    }
};


/**
 * Returns the attributes in a json format
 *
 * @return {string}
 */
GenericObject.prototype.toJson = function(){
    return JSON.stringify(this.toObject());
};


/**
 * Returns the attributes in a simple object
 *
 * @return {object}
 */
GenericObject.prototype.toObject = function(){
    var simpleObject = {};
    var attributes = this.header.format;
    for(index in attributes){
        var name = index;
        var checkValue = typeof(this[name].value) == "undefined";
        simpleObject[name] = checkValue ? null : this[name].value;
    }

    return simpleObject;
};

/**
 * Sets the values passed
 *
 * @param {Object} values Object in the format {key: value}
 */
GenericObject.prototype.batchSet = function(values){
    for(i in values){
        this[i].set(values[i]);
    }
};
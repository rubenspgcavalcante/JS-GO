/**
 * Generates a object with attributes of especif types.
 * If the user tries to set a value in a non attribute or of a
 * diferent type (if defined), generates a error.
 * 
 * @author Rubens Pinheiro Gonçalves Cavalcante
 * @email rubenspgcavalcante@gmail.com
 * @since jan 2013
 */

 /*
 * Generic Object
 * @constructor
 * @param {string} className A string to indentify the class of objects from this type
 * @param {Array<object>} attributes containing {name, type} objects and optionally {notNull, useCast}
 * @param {Object} (Optional) child who will extend
 */
GenericObject = function GenericObject(className, attributes, child){

    var that = this;
    var _size = 0;

    // Where the attributes types will be stored
    var types = {};

    // Where the not null flags will be stored
    var notNulls = {};

    // Where the use cast flags will be stored
    var useCast = {};

    // Where the max size values will be stored
    var maxSize = {};

    // Where we store the constructors to use in cast
    var objectConstructor = {};

    // -------------------------- Building Header -------------------------//
    /**
    * The object header, wich contains some information of this object
    * @static
    */
    this.header = {};

    var format = {};
    for(i in attributes){
        //If no type passed, assume typeless
        attributes[i].type = (typeof(attributes[i].type) == "undefined")?  "typeless" : attributes[i].type;

        try {
            GenericObject.validateAttribute(attributes[i]);
        }
        catch(e) {
            console.error(e);
            return null;
        }

        var name = attributes[i].name.replace(/\ |\./g, "_");
        

        format[name] = {
            type: attributes[i].type,
            notNull: attributes[i].notNull,
            useCast: attributes[i].useCast,
            objectConstructor: attributes[i].objectConstructor
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
        var attr = attributes[i].name.replace(/\ |\./g, "_");
        this[attr] = {name:attr, value: null};
        _size++;

        types[attr]     = (attributes[i].type == undefined) ? "undefined" : attributes[i].type;
        maxSize[attr]   = (typeof(attributes[i].maxSize) == "number") ? attributes[i].maxSize : null;
        notNulls[attr]  = (attributes[i].notNull == true) ? true : false;
        useCast[attr]   = (attributes[i].useCast == true) ? true : false;
        objectConstructor[attr] = (attributes[i].objectConstructor == undefined) ? null : attributes[i].objectConstructor;
        
        /**
         * Validates the value passed based on the type of the object
         * Note if you're using directly, the value will not be casted, if you want
         * to test if a value it's ok to a attribute which uses cast, first cast this
         * using the 'cast' method and then pass to the validate
         *
         * @param Any value to validade
         */
        this[attr].validate = function(value){
            var name = this.name;
            var type = GenericObject.typesLibrary[types[name]];

            if(value == null || value == ""){
                if(notNulls[name]){
                    return {valid: false, error: TypeError(name +" can't be null")};
                }
            }

            if(typeof(value.length) != "undefined" && maxSize[name] != null){
                if(value.length > maxSize[name]){
                    return {valid: false, error: TypeError(name +" overflowed maximun size of " + maxSize[name])};
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
         * @param constructor Constructor to use if needed
         * @return The value in the correct format
         */
        this[attr].cast = function(value, constructor){
            var name = this.name;
            var type = GenericObject.typesLibrary[types[name]];

            if(typeof(type.cast) != "undefined"){
                return type.cast(value, constructor);
            }

            else{
                return value;
            }

        };
        
        /**
         * Default setter to attr key of the object
         *
         * @param Value based on the type of this atribute to set
         * @param Options to pass to caster
         */
        this[attr].set = function(value){

            if(useCast[this.name]){

                value = this.cast(value, objectConstructor[this.name]);
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
            return {
                type: types[this.name],
                notNull: notNulls[this.name],
                useCast: useCast[this.name],
                maxSize: maxSize[this.name]
            };
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
        //Exludes any function added to Object.prototype
        if(typeof(values[i]) != "function"){
            if(typeof(this[i]) == "undefined"){
                throw Error("GenericObject " + this.header.className + " doesn't have the property " + i);
            }
            else{
                this[i].set(values[i]);
            }
        }
    }
};

/**
 * Validates the format and values of one value of the parameter "attributes"
 * of the GenericObject Constructor
 *
 * @static
 * @param {Object} attr The attribute object to validate
 */
GenericObject.validateAttribute = function(attr){
    if(typeof(attr.name) != "string") {
        throw Error("key name must be a string");
    }

    if(typeof(attr.type) != "string" || typeof(GenericObject.typesLibrary[attr.type]) == "undefined"){
        throw Error(
            attr.name + " attribute\n\t" +
            attr.type + " is not a valid type. Look for valid types using GenericObject.types function"
        );
    }

    if(
        typeof(attr.type) == "genericobject" && attr.useCast == true &&
        (typeof(attr.objectConstructor) != "function" || !(new attr.objectConstructor() instanceof GenericObject))
    ) {
        throw Error(
            attr.name +
            " uses cast, please pass as parameter the objectConstructor of a GenericObject instance"
        );
    }
};
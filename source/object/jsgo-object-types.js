/**
 * A static object that contains all the types
 * @static
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
            return Math.abs(Number(value));
        }
    },

    negative: {
        validate: function(value){
            return typeof(value) == "number" && value <= 0;
        },
        cast: function(value){
            var number = Number(value)
            return (number <= 0)? number : -number;
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
};


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
};

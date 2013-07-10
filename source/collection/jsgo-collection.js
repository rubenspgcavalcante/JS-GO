/**
 * A collection ready to contain only generic objects childs
 *
 * @author Rubens Pinheiro Gonçalves Cavalcante
 * @email rubenspgcavalcante@gmail.com
 * @since jan 2013
 *
 */
 
/*
 * A collection of GenericObjects childs
 * @constructor
 */
GenericObjectCollection = function(){
    this.objects = [];
};


/**
 * Add a object or objects to the collection.
 * Accepts n parameters e.g., go.add(obj1, obj2, obj3, ... objN)
 * where this 'obj' can be uniques GenericObjects or Arrays of GenericObjects
 *
 * @param objects Can be a array or a unique object
 */
GenericObjectCollection.prototype.add = function(objects){
    var args = arguments;
    for(i in args){
        if(typeof(args[i].length) != "undefined"){
            for(j in args[i]){
                if(args[i][j] instanceof GenericObject){
                    this.objects.push(args[i][j]);
                }
            }
        }
        else if(args[i] instanceof GenericObject){
            this.objects.push(args[i]);
        }
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
    var result = this._find(attr, value, false);
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
        var result = this._find(attr, value, false);
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
    var result = this._find(attr, value, true);
    if(result != null){
        return result.index;
    }
    else{
        return -1;
    }
};

/**
 * Removes the first ocurrence that matchs
 * 
 * @param {string} attr Atribute name do search into objects
 * @param value The value to search
 * @return {boolean} If removed
 */
GenericObjectCollection.prototype.remove = function(attr, value){
    var res = this._find(attr, value, true);
    
    if(res != null){
        this.objects.splice(res.index, 1);
        return true;
    }
    else{
        return false;
    }
};

/**
 * Transforms into a list of pure structures
 * 
 * @return {Array<Object>}
 */
GenericObjectCollection.prototype.toObjects = function(){
    var structures = [];
    for(i in this.objects){
        structures.push(this.objects[i].toObject());
    }

    return structures;
};


/**
 * Sorts the collection
 * 
 * @param {string} attribute Wich attribute to use as key in sorting
 * @param {string} order Define if ascending sort. Default "asc"
 */
GenericObjectCollection.prototype.sort = function(attribute, order){
    if(typeof(order) == "undefined" || order != JSGO.ORDER.ASC && order != JSGO.ORDER.DESC){
        throw Error("Order type unrecognized. Use JSGO.ORDER enumeration.");
    }

    this.objects.sort(function(a, b){
        a = a[attribute].get();
        b = b[attribute].get();
        
        if(a > b){
            if(order == JSGO.ORDER.ASC) return 1;
            else return -1;
        }
        if(a < b){
            if(order == JSGO.ORDER.ASC) return -1;
            else return 1;
        }
        else return 0;
    });
};

/**
 * Iterates under the objects of the collection
 *
 * @param {function(index, value)} Callback to process the values
 */
GenericObjectCollection.prototype.each = function(callback){
    for(var i = 0; i < this.objects.length; i++){
        callback(i, this.objects[i]);
    }
};

/**
 * Prints into console into a pretty format
 */
GenericObjectCollection.prototype.prettyPrint = function(echo){
    var print = "";
    var list = this.toObjects();
    for(i in list){
        print += "index: " + i + " Class: " + this.objects[i].header.className + "\n";
        for(j in list[i]){
            print += "\t" + j + ": " + list[i][j] +"\n";
        }
        print += "\n\n";
    }
    if(echo == true){
        console.log(print);
    }
    return print;
};
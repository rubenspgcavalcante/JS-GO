GenericObjectCollection.Query.prototype.Update = function(attributes){
    if(Array.isArray(attributes)){
        this.query.selection = attributes;
    }

    else{
        var args = arguments;
        this.query.selection = [];
        for(i in args){
            this.query.selection.push(args[i]);
        }
    }

    var recordUpdate = {};

    this.query.type = JSGO.METHOD.UPDATE;
    //Call the From method of the Query object, look in jsgo-collection-query.js
    recordUpdate.From = this.fromFunc;
    
    return recordUpdate;
};

/**
 * What to do when UPDATE is called
 *
 * @private
 * @param {Array<string>} attributes The attributes update
 * @param {number} index The index to change
 * @return {boolean} If any attribute was really updated
 */
Object.defineProperty(GenericObjectCollection.Query.prototype, "__whenUpdate", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(attributes, index){
        var that = this;
        var flag = false;
        for(attr in attributes){
            try{
                //Update inner objects
                if(attributes[attr].indexOf(".") != -1){
                    var keysList = attributes[attr].split(".");
                    var finalObject = that.collection.objects[index];

                    //Get the reference of the inner object
                    var i = 0;
                    for(i; i < keysList.length -1 ; i++){
                        if(finalObject instanceof GenericObject){
                            finalObject = finalObject[keysList[i]].get();
                        }
                        else{
                            finalObject = finalObject[keysList[i]];
                        }
                    }

                    if(finalObject instanceof GenericObject){
                        finalObject[keysList[i]].set(that.query.updateTo[attr]);
                    }
                    else{
                        finalObject[keysList[i]] = that.query.updateTo[attr];
                    }
                }

                that.collection.objects[index][attributes[attr]].set(that.query.updateTo[attr]);
                flag = true;
            }
            catch (e){
                var value = that.query.updateTo[attr];
                var type = collection.objects[index][attributes[attr]].info().type;
                var info = that.collection.objects[index];

                var warn = "On UPDATE: Attribute " + attributes[attr] + " doesn't accepts " + value + " as a valid value\n";
                warn += "\tCollection index: " + index + "\n";
                warn += "\tAttribute type: " + type + "\n";
                warn += "\tObject:\n";

                console.warn(warn, info);
            }
        }
        return flag;
    }
});
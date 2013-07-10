#!/usr/bin/nodejs
/*  
    Testing 
    Requires node.js
    Requires Nodeunit
*/

require('../../build/jsgo.js');

var Customer = require('./models/customer.js');
var testCase = require('../nodeunit/lib/nodeunit').testCase;

/**
 * Util function to set some values into the collection
 * @param {GenericObjectCollection} collection
 */
function customerCollectionSet(collection){
    for(var i=1; i <= 100; i++){
        var customer = new Customer();
        customer.id.set(i);
        customer.name.set("Fulano " + i.toString());
        customer.age.set(18);
        customer.email.set("fulano" + i.toString() + "@email.com");
        customer.phone.set("+559999999" + i.toString());

        collection.add(customer);
    }
}

module.exports = testCase({

    setUp: function(callback) {
        this.collection = new GenericObjectCollection();
        callback();
    },

    CreateObjectCollection: function(test){
        test.expect(1);
        test.ok(this.collection instanceof GenericObjectCollection, "Instance creation");
        test.done();
    },

    AddObjectsInCollection: function(test){
        test.expect(1);
        customerCollectionSet(this.collection);
        test.equals(this.collection.objects.length, 100, "Addition test");
        test.done();
    },

    FindUniqueInCollection: function(test){
        test.expect(2);
        customerCollectionSet(this.collection);
        test.equals(this.collection.findUnique("id", 10).name.get(), "Fulano 10", "Find existing object");
        test.equals(this.collection.findUnique("id", 200), null, "Find unexisting object");
        test.done();
    },

    FindInCollection: function(test){
        test.expect(2);
        customerCollectionSet(this.collection);

        var customer = new Customer();
        customer.name.set("Fulano 10");
        this.collection.add(customer)

        test.equals(this.collection.find("name", "Fulano 10").length, 2, "Find two objects");
        test.equals(this.collection.find("name", "Fulano Sincrano").length, 0, "Find none objects");
        test.done();
    },

    FindIndex: function(test){
        test.expect(3);
        customerCollectionSet(this.collection);

        test.equals(this.collection.indexOf("id", 10), 9);
        test.equals(this.collection.indexOf("name", "Fulano 20"), 19);
        test.equals(this.collection.indexOf("name", "No one"), -1);

        test.done();
    },

    FindIndexes: function(test){
        test.expect(3);
        customerCollectionSet(this.collection);

        var customer = new Customer();
        customer.name.set("Fulano 10");
        this.collection.add(customer)

        test.equals(this.collection.indexesOf("name", "Fulano 10").length, 2)

        var indexes = this.collection.indexesOf("name", "Fulano 10");
        test.equals(this.collection.objects[indexes[0]].name.get(), "Fulano 10")
        test.equals(this.collection.objects[indexes[1]].name.get(), "Fulano 10")
        test.done();
    },

    ReverseOrder: function(test){
        test.expect(1);
        customerCollectionSet(this.collection);

        this.collection.sort("id", JSGO.ORDER.DESC);
        var flag = true;
        for(var i=0; i < 100; i++){
            if(this.collection.objects[i].id.get() != 100-i){
                flag = false;
            }
        }
        test.ok(flag, "Reverse sort");
        test.done();
    },

    Each: function(test){
        test.expect(1);
        var index = 0;
        var flag = true;
        customerCollectionSet(this.collection);
        this.collection.each(function(i, data){
            if(i != index){
                flag = false;
            }
            index++
        });
        test.ok(flag, "Each iterator");
        test.done();
    },

    EachBreak: function(test){
      test.expect(1);
        var index = 0;
        customerCollectionSet(this.collection);
        this.collection.each(function(i, data){
            if(i == 50){
                return false;
            }
            index++
        });
        test.equals(index, 50, "Each iterator break");
        test.done();  
    }

});
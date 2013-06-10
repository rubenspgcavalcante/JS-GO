#!/usr/bin/nodejs
/*  
    Testing 
    Requires node.js
    Requires Nodeunit
*/

require('../../build/jsgo.js');
require('./utils.js');

var Customer = require('./models/customer.js');
var testCase = require('../nodeunit/lib/nodeunit').testCase;

/**
 * Util function to set some values into the collection
 * @param {GenericObjectCollection} collection
 */
function customerCollectionSet(collection){
    for(var i=0; i <= 100; i++){
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
    }

});
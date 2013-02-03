#!/usr/bin/nodejs
/*  
    Testing 
    Requires node.js
    Requires Nodeunit
*/

require('../../build/jsgo.js');
require('./utils.js');
var testCase = require('../nodeunit/lib/nodeunit').testCase;

//Util function to set some values
function customerSet(customer){
    customer.id.set(10);
    customer.name.set("Joe");
    customer.age.set(19);
    customer.email.set("joe@email.com");
    customer.phone.set("+559999999999");
}

module.exports = testCase({

    setUp: function(callback) {
        this.Customer = function(){
            return new GenericObject("Customer", [
                {name: "id", type: "positive", notNull: true, useCast: true},
                {name: "name", type: "string", notNull: true},
                {name: "age", type:"positive", notNull: true},
                {name: "email", type:"email", notNull: true, maxSize: 25},
                {name: "phone", type: "phone"},
            ]);
        };

        this.customer = new this.Customer();
        callback();
    },

    
    CreateObjectCustomer: function(test) {
        test.ok(this.customer instanceof GenericObject, "Instance creation");
        test.done();
    },


    GenericObjectSet: function(test) {
        try{
            customerSet(this.customer);
            this.customer.id.set(-10);
        }
        catch(e){
            if(e instanceof TypeError){
                test.ok(false, "Error in set method: "+ e.message);
                test.done();
            }
        }
        test.ok(true, "Set ok");
        test.done();
    },
    

    GenericObjectGet: function(test) {
        customerSet(this.customer);
        test.expect(5);

        test.strictEqual(this.customer.id.get(), 10, "Error id");
        test.strictEqual(this.customer.name.get(), "Joe", "Error name");
        test.strictEqual(this.customer.age.get(), 19, "Error age");
        test.strictEqual(this.customer.email.get(), "joe@email.com", "Error email");
        test.strictEqual(this.customer.phone.get(), "+559999999999", "Error phone");

        test.done();
    },


    OtherMethods: testCase({
        Validate: function(test) {
            test.expect(5);

            test.ok(this.customer.id.validate(10), "error in validate id");
            test.ok(this.customer.name.validate("Joe"), "error in validate name");
            test.ok(this.customer.age.validate(19), "error in validate age");
            test.ok(this.customer.email.validate("joe@email.com"), "error in validate email");
            test.ok(this.customer.phone.validate("+559999999999"), "error in validate phone");

            test.done();
        },


        Info: function(test) {
            test.expect(5);

            test.ok(this.customer.id.info().equals({type: "positive", notNull: true, useCast: true, maxSize: null }), "Error id");
            test.ok(this.customer.name.info().equals({type: "string", notNull: true, useCast: false, maxSize: null }), "Error name");
            test.ok(this.customer.age.info().equals({type:"positive", notNull: true, useCast: false, maxSize: null }), "Error age");
            test.ok(this.customer.email.info().equals({type:"email", notNull: true, useCast: false, maxSize: 25 }), "Error email");
            test.ok(this.customer.phone.info().equals({type: "phone", notNull: false, useCast: false , maxSize: null }), "Error phone");

            test.done();
        },

        Cast: function(test) {
            test.expect(3);

            test.strictEqual(this.customer.id.cast("-10"), 10, "Error id");
            test.strictEqual(this.customer.name.cast(9001), "9001", "Error name");
            test.strictEqual(this.customer.age.cast(-19), 19, "Error age");

            test.done();
        }

    }),

    TypesLibrary: testCase({

        Cast: function(test){
            var types = GenericObject.typesLibrary;
             test.expect(12);

            test.strictEqual(types.string.cast(-10.2), "-10.2", "Error string cast");
            test.strictEqual(types.number.cast("-10.3"), -10.3, "Error number cast");
            test.strictEqual(types.positive.cast("-10.5"), 10.5, "Error positive cast");
            test.strictEqual(types.negative.cast(10.5), -10.5, "Error negative cast");
            test.strictEqual(types.integer.cast(10,5), 10, "Error integer cast");
            test.strictEqual(types.boolean.cast(42), true, "Error boolean cast");
            test.strictEqual(types.year.cast(new Date(2012 ,0 ,1)), 2012, "Error year cast");

           var newObj = types.genericobject.cast({
                id: 10, 
                name: "Joe",
                age: 19,
                email: "joe@email.com",
                phone: "+559999999999",
            }, this.Customer);

             test.strictEqual(newObj.id.get(), 10, "Error genericobject cast: id");
             test.strictEqual(newObj.name.get(), "Joe", "Error genericobject cast: name");
             test.strictEqual(newObj.age.get(), 19, "Error genericobject cast: age");
             test.strictEqual(newObj.email.get(), "joe@email.com", "Error genericobject cast: email");
             test.strictEqual(newObj.phone.get(), "+559999999999", "Error genericobject cast: phone");

            test.done();
        }

    })
  
});
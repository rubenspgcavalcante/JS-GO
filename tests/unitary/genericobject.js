#!/usr/bin/nodejs
/*  
    Testing 
    Requires node.js
    Requires Nodeunit
*/

require('../../build/jsgo.js');

var Customer = function(){
        return new GenericObject("Customer", [
            {name: "id", type: "number", notNull: true},
            {name: "name", type: "string", notNull: true},
            {name: "age", type:"positive", notNull: true},
            {name: "email", type:"email", notNull: true, maxSize: 25},
            {name: "cpf", type:"cpf"},
            {name: "phone", type: "phone"},
        ]);
    };

exports.CreateObjectCustomer = function(test){

    var customer = new Customer();
    test.expect(1);
    test.ok(customer instanceof GenericObject, "Instance created");
    test.done();
};
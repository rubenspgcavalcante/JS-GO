#!/usr/bin/node
/*  
    Average peformance tester
    Requires node.js
*/

require('../../build/jsgo.js');
require('./peformance.js');

var TestClass = function(name, email){
    var obj = new GenericObject("TestClass", [
        {name: "name", type:"string"},
        {name: "email", type:"email"}
    ]);
    obj.name.set(name);
    obj.email.set(email);
    return obj;
};

function genRandString(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function genRandObjects(num){
    var list = []
    while(num--){
        var name = genRandString();
        var email = genRandString() + "@mail.com";

        list.push(new TestClass(name, email));
    }
    return list;
}



var perf = new Peformance();

/*
 * Tests the time of instancing 1000 objects of TestClass
 *
 */
perf.test('Testing instantiating 1000 GenericObjects', function() {
    for(var i=0; i<=1000; i++){
        var obj = new TestClass("test", "test@mail.com");
    }
}, 100);


var listOfObjects = genRandObjects(1000);
var collection = new GenericObjectCollection();

/*
 * Tests the time of add into a collection 100000 objects of TestClass
 *
 */
perf.test('Testing add 1000 GenericObjects into a collection', function(){
    collection.add(listOfObjects);
}, 100);


/*
 * Tests the time of add into a collection 100000 objects of TestClass
 *
 */
perf.test('Testing speed of a SELECT into a collection of size 1000', function(){
    var query = new GenericObjectCollection.Query(collection);
    var Filter = GenericObjectCollection.Filter;

    query = query
                .Select("name", "email")
                .From("TestClass")
                .Where(new Filter("name", JSGO.OPERATOR.GTE, "abc"));

    query.run();

}, 10);
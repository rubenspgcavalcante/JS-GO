JS-GO (Javascript Generic Object)
===========

##About

A generic object to help the creation of objects wich some attributes can't be too dinamic.
This give some basic objects, but can be extended with extra types defined by the programer.
Comes with some default methods (set, get, validate and cast) to each attribute created.

##How to use it?

First, how to create a new instace with this object. Bellow we will use the customer class as 
a example.

First we create a new class Customer, wich the respective attributes, and create one object. Note the 'Not empty' attribute will be converted to the name Not_empty. All whitespaces will be turned into underline.  
Each attribute must be in the format {name, type, notNull, useCast}, the two last are optional.
```javascript
var Customer = function(){
    return new GenericObject([
        {name: "name", type: "string", notNull: true, useCast: true},
        {name: "age", type:"positive", notNull: true},
        {name: "email", type:"email"},
        {name: "phone", type: "phone"},
        {name: "anything"}, //Undefined type, a normal js variable :)
        {name: "Not empty", notNull: true} //Anything but not 0, "", null and undefined
    ]);
};

var fooCustomer = new Customer();
```
So we can add some values to the attributes:
```javascript
fooCustomer.name.set("foo");
fooCustomer.name.set(10); //The cast will turn 10 into "10"
fooCustomer.age.set(23);
fooCustomer.email.set("foo@bar.com");
fooCustomer.anything.set("The answer");
fooCustomer.anything.set(42);
```
If any value can't be casted (if enabled) or is not valid to a type, the set method will throw a `typeError`, e.g.
```javascript
fooCustomer.age.set(0); //Age can't be null
fooCustomer.age.set(-10); //This age is not a valid positive type
fooCustomer.email.set("imnotaemail"); //This not a valid email type
fooCustomer.Not_empty.set(""); //Not_empty can't be null
```
As you can see, the 0 (and the "" empyt string) are considered null.  
You can validade the values before set then with the validate method. This method returns a object {valid, error}.
```javascript
fooCustomer.age.validate(10); //This will return {valid: true, error: null}
fooCustomer.age.validate(-10); //This will return {valid: false, error: TypeError("age must be a positive")
```
We can verify the type and if the attribute can be null using the method info:
```javascript
fooCustomer.email.info().type; // 'email'
fooCustomer.email.info().notNull; // false
```
Now we'll create a new type :)  
We'll use the static method newType. We pass the name of the type, a function to validade and optionally other function to be a caster.
```javascript
GenericObject.newType("ni", function(value){
    return /^(ni)(\ ni)*$/.test(value);
});
```
Now we've created the ni type, and lets create something to use this type
```javascript
var Knight = function(){
    return new GenericObject([
        {name: "say", type: "ni"},
        {name: "otherAtrribute", type: "string"}
    ]);
}

michaelP = new Knight();

michaelP.say.set("ni ni ni");
alert(michaelP.say.get()); // ni ni ni
```
We can retrieve the atributes too in a simple object or in a json format:
```javascript
michaelP.toObject(); // Returns a object {say: 'ni ni ni', otherAttribute: null}
michaelP.toJson(); //Returns a string "{"say": 'ni ni ni', "otherAttribute": null}"
```
It's usefull when needs to send this data to a webserver.  

##Other methods
###size

---
Return the size based only in the attributes
```javascript
fooCustomer.size(); // Returns 6
```
###types

---
*Static*  
Return a list of registered types, including the custom types builded using GenericObject.newType method:
```javascript
GenericObject.types();
```
##Techincal Information

It still in beta so I'm developing in Firefox 18.0 and not have tested in others browsers. In future I will test in various browsers :)

##Author

Rubens Pinheiro Gonçalves Cavalcante  
email: [rubenspgcavalcante@gmail.com](mailto:rubenspgcavalcante@gmail.com)

##License & Rights

Using GNU LESSER GENERAL PUBLIC LICENSE *Version 3, 29 June 2007*  
[gnu.org](http://www.gnu.org/copyleft/gpl.html)  

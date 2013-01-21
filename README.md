JS-GO (Javascript Generic Object)
===========

##About

A generic object to help the creation of objects wich some attributes can't be too dinamic.
This give some basic objects, but can be extended with extra types defined by the programer.
Comes with some default methods (set, get, validate and cast) to each attribute created.

##How to use it?

First, how to create a new instace with this object. Bellow we will use the customer class as 
a example.

First we create a new class Customer, wich the respective attributes, and create one object

    var Customer = function(){
        return new GenericObject([
            {name: "name", type: "string", notNull: true},
            {name: "age", type:"positive", notNull: true},
            {name: "email", type:"email"},
            {name: "phone", type: "phone"},
        ]);
    };

    var fooCustomer = new Customer();

So we can add some values to the attributes:

    fooCustomer.name.set("foo");
    fooCustomer.age.set(23);
    fooCustomer.email.set("foo@bar.com");

If any value can not be casted or is not valid to a type, the set method will throw a `typeError`, e.g.

    fooCustomer.age.set(0); //Age can't be null
    fooCustomer.age.set(-10); //This age is not a valid positive type
    fooCustomer.email.set("imnotaemail"); //This not a valid email type

As you can see, the 0 (and the "" empyt string) are considered null.  
You can validade the values before set then with the validate method. This method returns a object {valid, error}.

    fooCustomer.age.validate(10); //This will return {valid: true, error: null}
    fooCustomer.age.validate(-10); //This will return {valid: false, error: TypeError("age must be a positive")}

Now we'll create a new type :)  
We'll use the static method newType. We pass the name of the type, a function to validade and optionally other function to be a caster.

    GenericObject.newType("ni", function(value){
        return /^(ni)(\ ni)*$/.test(value);
    });

Now we've created the ni type, and let create something to use this type

    var Knight = function(){
        return new GenericObject([
            {name: "say", type: "ni"}
        ]);
    }

    michaelP = new Knight();

    michaelP.say.set("ni ni ni");
    alert(michaelP.say.get()); // ni ni ni

##Techincal Information

It still in beta so I'm developing in Firefox 18.0 and not have tested in others browsers. In future I will test in various browsers :)

##Author

Rubens Pinheiro Gonçalves Cavalcante  
email: [rubenspgcavalcante@gmail.com](mailto:rubenspgcavalcante@gmail.com)

##License & Rights

Using GNU LESSER GENERAL PUBLIC LICENSE *Version 3, 29 June 2007*  
[gnu.org](http://www.gnu.org/copyleft/gpl.html)  
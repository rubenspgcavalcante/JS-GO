// Here we add a new custom type 'cpf' and how validate him
GenericObject.newType("cpf", function(value){
    return /^[0-9]{3}.?[0-9]{3}.?[0-9]{3}-?[0-9]{2}/.test(value);
});

// Now we build a class Customer with some attributes
var Customer = function(){
    return new GenericObject("Customer", [
        {name: "id", type: "number", notNull: true},
        {name: "name", type: "string", notNull: true},
        {name: "age", type:"positive", notNull: true},
        {name: "email", type:"email", notNull: true},
        {name: "cpf", type:"cpf"},
        {name: "phone", type: "phone"},
    ]);
};

var customer1 = new Customer();
customer1.id.set(1);
customer1.name.set("John");
customer1.age.set(21);
customer1.email.set("john@email.com");


var customer2 = new Customer();
customer2.id.set(2);
customer2.name.set("Jack");
customer2.age.set(26);
customer2.email.set("jack@email.com");


var customer3 = new Customer();
customer3.id.set(3);
customer3.name.set("Billy");
customer3.age.set(46);
customer3.email.set("billy@email.com");


var customer4 = new Customer();
customer4.id.set(4);
customer4.name.set("Joe");
customer4.age.set(67);
customer4.email.set("joe@email.com");


var customer5 = new Customer();
customer5.id.set(5);
customer5.name.set("Armstrong");
customer5.age.set(34);
customer5.email.set("armstrong@email.com");

var collection = new GenericObjectCollection();
collection.add(customer1, customer2, customer3, customer4, customer5);

var query = new GenericObjectCollection.Query(collection);
var Filter = GenericObjectCollection.Filter;

query = query.Delete("id", "name", "email").From("Customer").Where(new Filter("id", "gte", 4).OR("name", "eq", "John"));


query.run();
console.log(collection.toObjects());

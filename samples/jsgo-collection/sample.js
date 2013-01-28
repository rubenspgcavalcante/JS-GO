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
customer1.batchSet({id: 1, name: "John", age:21, email: "john@email.com"});

var customer2 = new Customer();
customer2.batchSet({id: 2, name: "Jack", age:18, email: "jack@email.com"});


var customer3 = new Customer();
customer3.batchSet({id: 3, name: "Billy", age:46, email: "billy@email.com"});


var customer4 = new Customer();
customer4.batchSet({id: 4, name: "Joe", age:64, email: "joe@email.com"});


var customer5 = new Customer();
customer5.batchSet({id: 5, name: "Armstrong", age:34, email: "armstrong@email.com"});

var collection = new GenericObjectCollection();
collection.add(customer1, customer2, customer3, customer4, customer5);

var query = new GenericObjectCollection.Query(collection);
var Filter = GenericObjectCollection.Filter;


document.onreadystatechange = function(){
    if ('complete' == document.readyState) {
        document.getElementById("before").innerHTML = collection.prettyPrint();
        query = query.Select("id", "name", "email").From("Customer").Where(new Filter("id", "gte", 4).OR("name", "eq", "John"));

        var result = query.run();

        var html = ""
        for(i in result){
            html += "<ul>";
                html += "<li>"+ result[i].id +"</li>";
                html += "<li>"+ result[i].name +"</li>";
                html += "<li>"+ result[i].email +"</li>";
            html += "</ul><br/>";
        }

        document.getElementById("after").innerHTML = html;
    }
}
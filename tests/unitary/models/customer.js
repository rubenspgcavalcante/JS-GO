var Customer = function(){
    return new GenericObject("Customer", [
        {name: "id", type: "positive", notNull: true, useCast: true},
        {name: "name", type: "string", notNull: true},
        {name: "age", type:"positive", notNull: true},
        {name: "email", type:"email", notNull: true, maxSize: 25},
        {name: "phone", type: "phone"},
    ]);
};

module.exports = Customer;
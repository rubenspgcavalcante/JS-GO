// Here we add a new custom type 'cpf' and how validate him
GenericObject.newType("cpf", function(value){
    return /^[0-9]{3}.?[0-9]{3}.?[0-9]{3}-?[0-9]{2}/.test(value);
});

// Now we build a class Cliente with some attributes
var Cliente = function(){
    return new GenericObject([
        {name: "id", type: "number", notNull: true},
        {name: "nome", type: "string", notNull: true},
        {name: "idade", type:"positive", notNull: true},
        {name: "email", type:"email", notNull: true},
        {name: "cpf", type:"cpf"},
        {name: "fone", type: "phone"},
        {name: "sem tipo", notNull: true},
    ]);
};

// Create a new instace of cliente to apply in the form
var cliente1 = new Cliente();
var cliente2 = new Cliente();
var cliente3 = new Cliente();
var cliente4 = new Cliente();

cliente1.id.set(1);
cliente2.id.set(2);
cliente3.id.set(3);
cliente4.id.set(4);

var list = new GenericObjectCollection();
list.add(cliente1);
list.add(cliente2);
list.add(cliente3);
list.add(cliente4);


// Initing the validations
$(document).ready(function(){
    var formPath = "#mainContainer #genericObjectTest";
    $(formPath).submit(function(){

        var valid = true;

        $(formPath + " .attr").each(function(index, value){
            var name = $(this).attr("name");

            if(cliente[name].validate(this.value).valid){
                $(formPath + " #"+name+"Error").html("");
                cliente[name].set(this.value);
            }

            else{
                valid = false;
                $(formPath + " #"+name+"Error").html("Campo "+ name +" inválido");
            }

        });

        return valid;
    });


});
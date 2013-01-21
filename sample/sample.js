// Here we add a new custom type 'cpf' and how validate him
GenericObject.newType("cpf", function(value){
    return /^[0-9]{3}.?[0-9]{3}.?[0-9]{3}-?[0-9]{2}/.test(value);
});

// Now we build a class Cliente with some attributes
var Cliente = function(){
    return new GenericObject([
        {name: "nome", type: "string", notNull: true},
        {name: "idade", type:"positive", notNull: true},
        {name: "email", type:"email", notNull: true},
        {name: "cpf", type:"cpf"},
        {name: "fone", type: "phone"},
        {name: "sem tipo", notNull: true},
    ]);
};

// Create a new instace of cliente to apply in the form
var cliente = new Cliente();

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
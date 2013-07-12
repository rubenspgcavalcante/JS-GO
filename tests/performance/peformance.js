Peformance = function(){
    this.last = {name: null, seconds: 0};   
}

Peformance.prototype.test = function(name, func, times){
    if(typeof(times) == "undefined"){
        times = 1;
    }
    var average = 0;
    var repeats = times;

    console.log("\n#-------------------------------------------------#");
    console.log("Running: \n\t"+name+"...");

    while(repeats--){
        var start = Date.now();
        func();
        var end = Date.now();

        average += end - start;
    }

    console.log("\tfinished!\n");

    var total = (average/times)/1000;

    console.log("Average time: " + total + " seconds");
    console.log("Number of repeats: " + times);
    console.log("#-------------------------------------------------#\n");

    this.last.name = name;
    this.last.seconds = total;
};
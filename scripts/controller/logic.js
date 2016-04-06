
/*******************************************************  
    CONSTRUCTORS
  ******************************************************* */

//  define name of the modeule, add dependencies 
define('./controller/logic', ['require', 'exports', 'knockout', 'validation'], function (require, exports, ko) {   

    console.log('in start logic.js')

 // ko.validation.init()
    
    
    
    
    function Account(id, name, description, balance) {
   
            this.id = ko.observable(id);
            this.name = ko.observable(name);
            this.description = ko.observable(description);
            this.balance = ko.observable(balance);


    }


    function Transaction(id, name, amount, date) {

        this.id = ko.observable(id);
        this.name = ko.observable(name);
        /*this.amount = ko.observable(parseInt(amount));*/
        this.amount = ko.observable(amount).extend({number: true, required: true});
        this.date = ko.observable(date);


    }

/*******************************************************  
    OBJECTS
  ******************************************************* */
    var one = new Transaction(1, "Transaction one", 50, new Date());
    var two = new Transaction(2, "Transaction two", 650, new Date())
    var three = new Transaction(3, "Transaction three", 70, new Date())
    var four = new Transaction(4, "Transaction four", 80, new Date())



    var transactions = ko.observableArray([one, two, three]);

  

    var runningTotal = ko.pureComputed(function () {

        var result = 0;
        transactions().forEach(function (value) {
            result += value.amount();
        });
        return result;
    });


    var myAccount = new Account(10001, "Mark Che"," My Checking Account ", runningTotal);
    
    

    console.log(myAccount);

  /*******************************************************  
    FUNCTIONS
  ******************************************************* */
    
    
    
    function removeTransaction(data, evt) {
        transactions.remove(data);
    }


    function addTransaction() {
        
        transactions.push(new Transaction(four.id(), four.name(), four.amount(), four.date()));
    }

    console.log(ko);


    //  export object to make my data available to knockout   html data-binds   

    var app = {

        four: four,
        transactions: transactions,
        addTransaction: addTransaction,
        removeTransaction: removeTransaction,
        runningTotal: runningTotal,
        myAccount: myAccount
    }

    console.log("bindings applied");

    exports.app = app;
});

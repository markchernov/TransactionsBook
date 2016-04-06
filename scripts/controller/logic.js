if (typeof define !== 'function') {
    var define = require('../libs/amdefine')(module)
}

console.log('in start logic.js');

/*******************************************************  
    CONSTRUCTORS
  ******************************************************* */

//  define name of the module, add dependencies 
define('controller', ['require', 'exports', 'knockout', 'validation', 'moment'], function (require, exports, ko, validation, moment) {   

    console.log('in define logic.js')

 /*ko.validation.init({
        insertMessages: false,
        decorateInputElement: true,
        errorElementClass: 'has-error',
        messagesOnModified: false,
        decorateElementOnModified: false,
        decorateElement: true
    });
    */
    
    
    
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
        this.amount = ko.observable(parseInt(amount)).extend({number: true, required: true});
        
        //this.date = new Date;
        this.date = ko.observable(moment(date)).extend({ date: true });


    }

/*******************************************************  
    OBJECTS
  ******************************************************* */
    var one = new Transaction(1, "Transaction one", 50, "2011-10-10 17:05:14");
    var two = new Transaction(2, "Transaction two", 650, 1360002924000)
    var three = new Transaction(3, "Transaction three", 70, moment())
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


        exports.four= four;
        exports.transactions= transactions;
        exports.addTransaction= addTransaction;
        exports.removeTransaction= removeTransaction;
        exports.runningTotal= runningTotal;
        exports.myAccount= myAccount;
   

    console.log("bindings applied");

   
});

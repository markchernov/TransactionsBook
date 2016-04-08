if (typeof define !== 'function') {
    var define = require('../libs/amdefine')(module)
}

console.log('in start logic.js');

/*******************************************************  
    CONSTRUCTORS
  ******************************************************* */

//  define name of the module, add dependencies 
define('controller', ['require', 'exports', 'jquery', 'knockout', 'validation', 'moment', 'mapping'], function (require, exports, $, ko, validation, moment, mapping) {

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
        this.amount = ko.observable(parseInt(amount)).extend({
            number: true,
            required: true
        });

        //this.date = ko.observable(date);
        this.date = ko.observable(moment(date)).extend({
            date: true
        });


    }

    // set serialization rules to ignore observables
    // dont have to do this if using ko.toJSON
    /*Transaction.prototype.toJSON = function () {

        return {
            id: this.id(),
            name: this.name(),
            amount: this.amount(),
            date: this.date()
        }


    }*/

    /*******************************************************  
        OBJECTS
      ******************************************************* */
    var one = new Transaction(1, "Transaction one", 50, "2011-10-10 17:05:14");
    var two = new Transaction(2, "Transaction two", 650, 1360002924000)
    var three = new Transaction(3, "Transaction three", 70, moment())
    var four = new Transaction(4, "Transaction four", 80, new Date())



    var transactions = ko.observableArray([one, two, three]);

    var bankTransactions = ko.observableArray([one, two, three]);

    var persistedBankTransactions = ko.observableArray([]);

    //var persistedBankTransactions= [];

    var runningTotal = ko.pureComputed(function () {

        var result = 0;
        transactions().forEach(function (value) {
            result += value.amount();
        });
        return result;
    });


    var runningBankTotal = ko.pureComputed(function () {

        var result = 0;
        persistedBankTransactions().forEach(function (value) {
            result += value.amount();
        });
        return result;
    });


    var myAccount = new Account(10001, "Mark Che", " My Checking Account ", runningTotal);



    console.log(myAccount);

    /*******************************************************  
      FUNCTIONS
    ******************************************************* */

    function persistBankTransactionsInLocalStorage() {


        console.log("inside updateBankTransaction function");

        bankTransactions.push(new Transaction(four.id(), four.name(), four.amount(), four.date()));


        bankTransactions().forEach(function (value) {

    
            //  Knockout method to convert observable object to pure js object
            //var jsTransaction = ko.toJS(value);  
            //  Knockout method to stringify observable object to JSON
            var jsonTransaction = ko.toJSON(value);
            
            
            //localStorage.setItem(value.id(), JSON.stringify(value));

            localStrorage.setItem(jsonTransaction);
  

            console.log(jsonTransaction);

        });


        retriveBankTransactionsFromLocalStorage();

    }


    function retriveBankTransactionsFromLocalStorage() {


        console.log("inside retriveBankTransactionFromLocalStorage function");


        persistedBankTransactions.removeAll();

        for (var key in localStorage) {

            console.log(key);

           //persistedBankTransactions.push(JSON.parse(localStorage.getItem(key)));
            
           // mapping library from JSON back to observable conversion   
            
            console.log(localStorage.getItem(key));
            
            console.log(mapping);
            
            console.log(ko);
            
            //var persistedBankTransactionJSObject = JSON.parse(localStorage.getItem(key));
            
            var Transaction = mapping.fromJSON(localStorage.getItem(key));

            persistedBankTransactions.push(Transaction);
            
            persistedBankTransactions = persistedBankTransactions.sort(function (left, right) { return left.date() == right.date() ? 0 : (left.date() < right.date() ?  - 1 : 1) }); 
           

        }

          


    }



    function compareAccounts() {
    
        var result = 0;
        persistedBankTransactions().forEach(function (value) {
            result += value.amount;
        });
        return result;
    
    
    
    }




    function removeTransaction(data, evt) {
        transactions.remove(data);
    }


    function addTransaction() {

        transactions.push(new Transaction(four.id(), four.name(), four.amount(), four.date()));

        transactions = transactions.sort(function (left, right) { return left.date() == right.date() ? 0 : (left.date() < right.date() ?  - 1 : 1) });  
    }









    /*******************************************************  
    AJAX CALL TEST
  ******************************************************* */

    function Food(ndbno, name) {

        this.ndbno = ko.observable(ndbno);
        this.name = ko.observable(name);


    }



    var myFood = new Food(1001, "My Test Food");




    function updateFood(data, evt) {

        console.log("inside updateFood function");

        console.log(data);

        var url = 'http://localhost:8080/NutriTrac/rest/food/' + myFood.ndbno();

        //var url =  'http://feeds.financialcontent.com/account_name/JSQuote?Ticker=MSFT';    

        $.get(url, function (myData) {

            console.log("in AJAX get");
            console.log("My data from AJAX call: " + myData.name);

            myFood.ndbno(myData.ndbno);
            myFood.name(myData.name);


            console.log("My food object after AJAX call: " + myFood.name());



            // console.log("My data from AJAX call: " + myData);  


        });


    } // close update food function

    console.log(myFood);



    console.log("This is my observable Food object: " + myFood.name());


    //  export object to make my data available to knockout   html data-binds  
    exports.four = four;
    exports.transactions = transactions;
    exports.addTransaction = addTransaction;
    exports.removeTransaction = removeTransaction;
    exports.runningTotal = runningTotal;
    exports.myAccount = myAccount;
    exports.myFood = myFood;
    exports.updateFood = updateFood;
    exports.persistedBankTransactions = persistedBankTransactions;
    exports.persistBankTransactionsInLocalStorage = persistBankTransactionsInLocalStorage;
    exports.runningBankTotal = runningBankTotal;
    exports.retriveBankTransactionsFromLocalStorage = retriveBankTransactionsFromLocalStorage;


    console.log("bindings applied");


});

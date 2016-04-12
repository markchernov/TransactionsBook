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



    function Account(id, name, description, balance, transactions) {
     
        this.id = ko.observable(id);
        this.name = ko.observable(name);
        this.description = ko.observable(description);
        this.balance = ko.observable(balance);
        this.transactions = transactions;


    }

    // create custom toString for testing
    Account.prototype.toString = function accountToString() {
        var ret = 'Account Id: ' + this.id() + ' , name: ' + this.name() + ', Description: ' + this.description() + ' , Balance:  ' + runningTotal() + " ";
        return ret;
    }

     //var nextid = 1;
    //var nextid = Math.floor((Math.random() * 1000) + 1);;
    function Transaction(name, amount, date) {

        this.id = ko.observable(Math.floor((Math.random() * 1000) + 1));
        //this.id = ko.observable(nextid++);
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
    var one = new Transaction("Transaction one", 50, "2011-10-10 17:05:14");
    var two = new Transaction("Transaction two", 650, 1360002924000)
    var three = new Transaction("Transaction three", 70, moment())
    var newTransaction = new Transaction("Transaction four", 80, new Date())



    var transactions = ko.observableArray([one, two, three]);

    var bankTransactions = ko.observableArray([one, two, three]);

    var persistedBankTransactions = ko.observableArray([]);

    var unreconciledTransactions = ko.observableArray([]);

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

    var unreconciledTotal = ko.pureComputed(function () {

        var result = 0;
        unreconciledTransactions().forEach(function (value) {
            result += Math.abs(value.amount());
        });
        return result;
    });





    var myAccount = new Account(10001, "Mark Che", " My Checking Account ", runningTotal, transactions);



    console.log(myAccount);

    /*******************************************************  
      FUNCTIONS
    ******************************************************* */
    
    function persistAccountInLocalStorage() {


        console.log("inside persistAccountInLocalStorage function");



            //  Knockout method to convert observable object to pure js object
            //var jsTransaction = ko.toJS(value);  
            //  Knockout method to stringify observable object to JSON
            var jsonMyAccount = ko.toJSON(myAccount);


            //localStorage.setItem(value.id(), JSON.stringify(value));

            localStorage.setItem(myAccount.name(), jsonMyAccount);


            console.log(jsonMyAccount);

        };  
    

    function persistBankTransactionsInLocalStorage() {


        console.log("inside updateBankTransaction function");

        bankTransactions.push(new Transaction(newTransaction.name(), newTransaction.amount(), newTransaction.date()));


        bankTransactions().forEach(function (value) {


            //  Knockout method to convert observable object to pure js object
            //var jsTransaction = ko.toJS(value);  
            //  Knockout method to stringify observable object to JSON
            var jsonTransaction = ko.toJSON(value);


            //localStorage.setItem(value.id(), JSON.stringify(value));

            localStorage.setItem(value.id(), jsonTransaction);


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

            persistedBankTransactions = persistedBankTransactions.sort(function (left, right) {
                return left.date() == right.date() ? 0 : (left.date() < right.date() ? -1 : 1)
            });


        }




    }

    function compareAccounts() {


        console.log("inside compareAccounts function");

        persistedBankTransactions().forEach(function (object) {



            unreconciledTransactions.push(object);

        });


        console.log("This is unreconciledTransactions: " + unreconciledTransactions());

        console.log("This is persistedBankTransactions: " + persistedBankTransactions());

        transactions().forEach(function (value) {

            console.log("This is my transaction amount: " + value.amount());


            for (var key in persistedBankTransactions()) {


                var obj = persistedBankTransactions()[key];


                console.log("This is bank amount: " + obj.amount());

                if (value.amount() === obj.amount()) {


                    console.log("Check equal: " + obj.amount() + "to bank amount: " + value.amount());


                    unreconciledTransactions.remove(obj);
                }

            }




        });


        console.log("This is unreconciledTransactions after removal of matched transactions: " + unreconciledTransactions());

    };









    function removeTransaction(data, evt) {
        transactions.remove(data);
    }


    function addTransaction() {

        transactions.push(new Transaction(newTransaction.name(), newTransaction.amount(), newTransaction.date()));

        transactions = transactions.sort(function (left, right) {
            return left.date() == right.date() ? 0 : (left.date() < right.date() ? -1 : 1)
        });
        
        unreconciledTransactions.clear();
        
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

        var url = 'http://markche.com:8080/NutriTrac/rest/food/' + myFood.ndbno();

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
    exports.newTransaction = newTransaction;
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
    exports.unreconciledTransactions = unreconciledTransactions;
    exports.compareAccounts = compareAccounts;
    exports.unreconciledTotal = unreconciledTotal;
    exports.persistAccountInLocalStorage = persistAccountInLocalStorage;


    console.log("exports applied");

  /*  $(document).ready(function () {
        alert(myAccount)
    })*/
    
  
});

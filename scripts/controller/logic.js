if (typeof define !== 'function') {
    var define = require('../libs/amdefine')(module)
}

console.log('in start logic.js');

/*******************************************************  
    CONSTRUCTORS
  ******************************************************* */

//  define name of the module, add dependencies 
define('controller', ['require', 'exports', 'jquery', 'knockout', 'validation', 'moment'], function (require, exports, $, ko, validation, moment) {   

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

    
    Transaction.prototype.toJSON = function() {     
    
    return {  id: this.id(), name: this.name(), amount: this.amount(), date : this.date() }
    
    
    }
    
/*******************************************************  
    OBJECTS
  ******************************************************* */
    var one = new Transaction(1, "Transaction one", 50, "2011-10-10 17:05:14");
    var two = new Transaction(2, "Transaction two", 650, 1360002924000)
    var three = new Transaction(3, "Transaction three", 70, moment())
    var four = new Transaction(4, "Transaction four", 80, new Date())



    var transactions = ko.observableArray([one, two, three]);

    var bankTransactions = ko.observableArray([one, two, three]);
    
    var persistedBankTransactions = [];
    
    

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
    
    function persistBankTransactionsInLocalStrorage() {
        
        
        console.log("inside updateBankTransaction function");
        
        bankTransactions.push(new Transaction(four.id(), four.name(), four.amount(), four.date()));
        
        
        bankTransactions().forEach(function (value) {
            
        //bankTransactions.remove(value);  
            
        console.log(value);    
             
        localStorage.setItem(value.id() , JSON.stringify(value));

        //var myTransaction = JSON.parse(localStorage.getItem(value.id()));
            
        //var myTransaction =  localStorage.getItem(value.id());   

        //console.log(myTransaction.name);
        
       });
        
        
        retriveBankTransactionFromLocalStorage();
        
    }
    
    
    function retriveBankTransactionFromLocalStorage() {
        
        
        console.log("inside retriveBankTransactionFromLocalStorage function");       
        
        bankTransactions().forEach(function (value) {
            
            
        console.log(value);    
             

        var myTransaction = JSON.parse(localStorage.getItem(value.id()));
            
        persistedBankTransactions.push(myTransaction);   

        console.log("This is my array of plain JS objects size:  " + persistedBankTransactions.length);
        
       });
        
    }
    
    
    
    
    
    
    
    function removeTransaction(data, evt) {
        transactions.remove(data);
    }


    function addTransaction() {
        
        transactions.push(new Transaction(four.id(), four.name(), four.amount(), four.date()));
        
        persistBankTransactionsInLocalStrorage(); 
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
        
    var url =  'http://localhost:8080/NutriTrac/rest/food/' +  myFood.ndbno();  
     
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
        exports.four= four;
        exports.transactions= transactions;
        exports.addTransaction= addTransaction;
        exports.removeTransaction= removeTransaction;
        exports.runningTotal= runningTotal;
        exports.myAccount= myAccount;
        exports.myFood= myFood;
        exports.updateFood= updateFood;
        //exports.persistedBankTransactions = persistedBankTransactions;
   

    console.log("bindings applied");

   
});

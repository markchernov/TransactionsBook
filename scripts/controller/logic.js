/*var main = function()  {*/


// Constructors


define('./controller/logic', ['require', 'exports', 'knockout'], function (require, exports, ko) {


    //  define name of the modeule, add dependencies    

    console.log('in start logic.js')


    function Account(id, name, description, balance) {

            this.id = ko.observable(id),
            this.name = ko.observable(name),
            this.description = ko.observable(description),
            this.balance = ko.observable(balance)


    }


    function Transaction(id, name, amount) {

        this.id = ko.observable(id),
        this.name = ko.observable(name),
        this.amount = ko.observable(parseInt(amount))


    }

    // Objects 

    /*var myAccount = {
        id: ko.observable(1),
        name: ko.observable("MyAccount"),
        balance: ko.observable(100),
    };
*/

    /*var myBankAccount = {
        id: ko.observable(1),
        name: ko.observable("Checking"),
        balance: ko.observable(200),
    };


    var transaction = {
        id: ko.observable(1),
        name: ko.observable("Check"),
        amount: ko.observable(50),
    };
*/
    /*
    var myViewModel = {
        personName: ko.observable('Bob'),
        personAge: ko.observable(123)
    };*/



    /*var one = {
                
                id: ko.observable(1),
                name: ko.observable("Acc One"),
                amount: ko.observable(50)
            };

     var two = {
                id: ko.observable(2),
                name: ko.observable("Acc Two"),
                amount: ko.observable(60)
            };

     var three = {
                id: ko.observable(3),
                name: ko.observable("Acc Three"),
                amount: ko.observable(70)
            };

     var four = {
                id: ko.observable(4),
                name: ko.observable("Acc Four"),
                amount: ko.observable(80)
            };*/



    var one = new Transaction(1, "Transaction one", 50);
    var two = new Transaction(2, "Transaction two", 650)
    var three = new Transaction(3, "Transaction three", 70)
    var four = new Transaction(4, "Transaction four", 80)


    






    var transactions = ko.observableArray([one, two, three]);

  

    var runningTotal = ko.pureComputed(function () {

        var result = 0;
        transactions().forEach(function (value) {
            result += value.amount();
        });
        return result;
    });


    var myAccount = new Account(1, "Mark Che"," My Checking Account ", runningTotal);
    
    

    console.log(myAccount);

    // Functions


    function removeTransaction(data, evt) {
        transactions.remove(data);
    }


    function addTransaction() {
        
        transactions.push(new Transaction(four.id(), four.name(), four.amount()));
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

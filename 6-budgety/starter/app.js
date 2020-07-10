// budget Controller
var budgetController = (function () {
    var Expense = function (id, description, value) {

        this.id = id;
        this.description = description;
        this.value = value;


    };

    var Income = function (id, description, value) {

        this.id = id;
        this.description = description;
        this.value = value;


    };

    var allExpenses = [];

    var allIncomes = [];

    var totalExpenses = 0;

    var data = {
        allItems: {
            exp: [],
            inc: []

        },
        totals: {

            exp: 0,
            inc: 0
        }

    };
    return {
        addItem: function (type, des, val) {
            var newItem, ID;


            // create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;

            }


            // Create new Item based on inc or ex type

            if (type === 'exp') {
                newItem = new Expense(ID, des, val);

            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);

            }

            // push it into our data structure
            data.alltypes[type.push(newItem)];
            // return the new element
            return newItem;


        }

    };


})();
// UI controller
var UIController = (function () {

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn"

    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will either be inc or express
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,

            };


        },
        getDOMstrings: function () {
            return DOMstrings;
        }

    };


})();



// Global App Controller


var controller = (function (budgetCtrl, UICtrl) {
    var DOM = UICtrl.getDOMstrings();
    var setupEventListeners = function () {

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);



        document.addEventListener('keypress', function (event) {

            //console.log(event);

            if (event.Keycode === 13 || event.which === 13) {

                ctrlAddItem();

            }

        });


    }




    var ctrlAddItem = function () {

        var input, newItem
        //1. get the field input data

        var input = UICtrl.getInput();


        //2 add item to the budgetcontroller

        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //3  add item to the UI

        //4 calculate the budget

        // 5 display the budget in the UI


    };

    return {

        init: function () {
            console.log('application is running');

            setupEventListeners();

        }
    }

})(budgetController, UIController);

controller.init();
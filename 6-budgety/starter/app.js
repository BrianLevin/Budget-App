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

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum = sum + cur.value;
            data.totals[type] = sum;
        });
    }

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
        },
        budget: 0,
        percentage: -1

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


        },
deleteItem: function(type, id){
var ids, index
   var ids=  data.allItems[tyoe].map(function(current){

return current.id;

    });

    index= ids.indexOf(id);

    if(index !== -1) {

data.allitems[type].splice(index, 1)


    }

},


        calculateBudget: function () {
            //  calculate toytqal income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);


            } else {
                data.percentage = -1;
            }


        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage

            };

        },

        testing: function () {
            console.log(data);
        }
    };


})();
// UI controller
var UIController = (function () {

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetlabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__income-value',
        percentageLabel: '.budget__expenses-percent',
        container: '.container'

    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will either be inc or express
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),

            };


        },
        addListIem: function (obj, type) {
            var html, newHtml
            // create html string with place holder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>  </div>   </div>'

            }
            else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div> '

            }
            // replace the place holder with actual data

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description)

            newHtml = newHtml.replace('%value%', obj.value)

            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', NewHtml);
        },
        deleteListItem: function(selectorID) {
             var el= document.getElementById(selectorID);
             el.parentNode.removeChild(el)

        },

        clearFields: function () {
            var feilds, fieldsArr;
            fields = document.querySelectorAll(DOMstringd.inputDescription + ', ' + DOMstrings.inputValue)
            var fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },
        displayBudget: function (obj) {
            document.querySelector(DOMstrings.budgetLabel).textcontent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textcontent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textcontent = obj.totalExp;
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textcontent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textcontent = obj.percentage; + '---';
            }
        }

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

document.querySelector(DOM.container).addeventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function () {
        //1 calculate the budget
        budgetCtrl.calculateBudget();
        // 2return the budget
        var budget = budgetCtrl.getBudget();

        // 3  display the budget in the UI
        UICtrl.displayBudget(budget);

    }


    var ctrlAddItem = function () {

        var input, newItem;
        //1. get the field input data

        var input = UICtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2 add item to the budgetcontroller

            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3  add item to the UI
            UICtrl.addistItem(newItem, input.type);

            // 4. clear the fields
            UICtrl.clearFields();

            // calculate and update budget
            updateBudget();
        }

var ctrlDeleteItem = function(event) {
    var ItemID, splitID, type, ID;
itemID= (event.target.parentNode.parentNode.parentNode.parentNode.id)
if(itemID) {
splitID=itemID.split('-');
type= splitID[0];
ID= parseInt (split[1]);

// 1. delete the item from the data structure
budgetCtrl.deleteItem(type,ID);
//2 Delete the item from the UI
UICtrl.deleteListItem(itemID)
// 3. update and show the new bright
updateBudget();
}

}


    };

    return {

        init: function () {
            console.log('application is running');
            UICtrl.displayBudget( {
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1

            });

            setupEventListeners();

        }
    }

})(budgetController, UIController);

controller.init();
// BUDGET CONTROLLER MODULE
var budgetController = (function() {
    // function constructor ex which hold the values
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    
    Expense.prototype.calcPercentage = function(totalIncome) { // method calculates the percentage protype of expense variable
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100); // get the percentage and then round it
        } else {
            this.percentage = -1; //nan
        }
    };
    
    
    Expense.prototype.getPercentage = function() {
        return this.percentage; // gets percentage of object and then returns it
    };
    
    // function constructor income which hold the values
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    // calculate total income or expenses
    var calculateTotal = function(type) {
        var sum = 0; //intial value
        data.allItems[type].forEach(function(cur) { // type== inc or exp
            sum += cur.value; // calulate current value
        });
        data.totals[type] = sum; // totals will = the sum
    };
    
    // the values will get stored in this object array all expenses and total expenses and incmes
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0, // budget will = 0 before inc and exp are added
        percentage: -1 // -1 is means non existent when there is no budget
    };
    
    // return public methods  by making the privare functions public
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
           
            
            // Create new ID length, the array legnth minus 1 plus the next id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // Push it into our data structure
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;
        },
        
        
        deleteItem: function(type, id) {
            var ids, index;
            
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3
            // 
            ids = data.allItems[type].map(function(current) { // loop all data in income or expense array to turna brand new array
                return current.id; //  current id in the array
            });

            index = ids.indexOf(id); // retuns index number of the array

            if (index !== -1) { // if the index exist in the array, delete the number
                data.allItems[type].splice(index, 1); // splice removes elements
            }
            
        },
        
        
        calculateBudget: function() {
            
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); // round the percentage
            } else {
                data.percentage = -1;
            }            
            
            // Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100
        },
        
        calculatePercentages: function() {
            
            /*
            a=20
            b=10
            c=40
            income = 100
            a=20/100=20%
            b=10/100=10%
            c=40/100=40%
            */

            
            data.allItems.exp.forEach(function(cur) { // calculate the percentage for each expense  in our object
               cur.calcPercentage(data.totals.inc);
            });
        },
        
        
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {  // map returns the the  result of the getPercentage in a new array
                return cur.getPercentage();
            });
            return allPerc;
        },
        
        // Method to get the budget data
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
         //testing the data structure outside the function  before wring a method to display in UI
        testing: function() {
            console.log(data);
        }
    };
    
})();




// UI CONTROLLER MODULE
// event listeners set up as objects
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    
    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

        num = Math.abs(num); // calculate the absolute part of the number and remove the sign of it
        num = num.toFixed(2); // move up to 2 decimal places

        numSplit = num.split('.'); //split number into integer part and decimal part and gets stored in an array

        int = numSplit[0]; //  internet is the first element of the array
        if (int.length > 3) { // more then 3 elements in the number
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // substing takes part of the string that we want start at 0  snd then subtract 3 from the number,  then start at that subtraction of the number and then move up 3 //input 23510, output 23,510
        }

        dec = numSplit[1]; // second part of the array

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec; //ternitary opertator if its an exp or inc and then space plus inc plus dec,

    };
    
    
    var nodeListForEach = function(list, callback) { // loop throrugh the function based off the element and the index number
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    
    
    return {
        // function which will read the input data
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // parse flaot converts strings to numbers with decimals
            };
        },
        
        // function that create he html on the page based off of user input coming from the new item object
        addListItem: function(obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text //changed id, value, and description to   place holder based off of users choice
            
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace the placeholder text with some actual  user data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); // 'befend end will be the  inseerted  the final value once the new data is inputted
        },
        
        
        deleteListItem: function(selectorID) {
            
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el); // removes the child from the parent element
            
        },
        

        // clear input fields method
        clearFields: function() {
            var fields, fieldsArr;
            // clear input description and value
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            // turn the list of values into an array using the slice call method this will loop through array and clear all feilds selected
            fieldsArr = Array.prototype.slice.call(fields);
            //  loops over all the elements of the fields array and empties them
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            // focus methods allows the input data to go back to the description after it is cleared
            fieldsArr[0].focus();
        },
        
        // method which will display the budget
        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type); // data stored inobject , display budget labelonto the page
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc'); // display income on the page
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp'); // display expenses on the page
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%'; // add a percentage sign if object is greater then 0
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
            
        },
        
        
        displayPercentages: function(percentages) { // displays percentages on html page
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            nodeListForEach(fields, function(current, index) { // current element and the current index number of the element
                
                if (percentages[index] > 0) { // at the current index the percentage is greater then 0
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
            
        },
        
        
        displayMonth: function() { // object constructor to display month
            var now, months, month, year;
            
            now = new Date(); //grabs date
            
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        
        
        changedType: function() {
            
            var fields = document.querySelectorAll( // these will recieve red focus class
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
            
            nodeListForEach(fields, function(cur) { // call back function which will change the color of the value
               cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
        },
        
        // expose domstrings event listeners  and return to the public or outside the function
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
    
})();




// GLOBAL APP CONTROLLER MODULE
var controller = (function(budgetCtrl, UICtrl) {
    // event listerms  which exicute the get dom strings function throughout the code
    
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        
        // event listern for when  user clicks
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
// enter key pressed will activeae event
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        // user deletes item
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        // user changes value
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);   // change color around input     
    };
    
    // Function which will call the methods of each seperate funtion
    var updateBudget = function() {
        
        // 1. Calculate the budget 
        budgetCtrl.calculateBudget();
        
        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
        
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };
    
    
    var updatePercentages = function() {
        
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        
        // 2. Read percentages from the budget controller and store it
        var percentages = budgetCtrl.getPercentages();
        
        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };
    
    // function gets called when adding a new item
    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get the field input data
        input = UICtrl.getInput();        
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) { //  prevents strings, NAN, and 0 from popping up in the results and will only input  the below data if this statement is true
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();
            
            // 6. Calculate and update percentages
            updatePercentages();
        }
    };
    
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // DOM transfer to the target parrent element (income) when user clicks delete
        
        if (itemID) { // is clicked and defined
            
            //inc-1
            splitID = itemID.split('-'); // allows to break up the string into parts
            type = splitID[0]; // split inc or exp to  isolate that variable
            ID = parseInt(splitID[1]); // split ID number to z islate that variable
            
            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
            // 3. Update and show the new budget
            updateBudget();
            
            // 4. Calculate and update percentages
            updatePercentages();
        }
    };
    
    
    return { //  function which will  set everything back to 0 once the page loads
        init: function() {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            // exacute the event listeners when the user clicks and presses they key
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);

// allows the application to start  making the event listeners public
controller.init();
// budget Controller
var budgetController = (function () {
   


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
         getInput: function() {
         return {
             type: document.querySelector(DOMstrings.inputType).value, // will either be inc or express
             description: document.querySelector(DOMstrings.inputDescription).value,
             value: document.querySelector(DOMstrings.inputValue).value,

         };
         
        
    },
getDOMstrings: function() {
    return DOMstrings;
}

};


})();



// Global App Controller


var controller = (function (budgetCtrl, UICtrl) {
    var DOM = UICtrl.getDOMstrings();
    var setupEventListeners = function(){

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
       


   document.addEventListener('keypress', function(event){

    //console.log(event);

    if(event.Keycode === 13 || event.which === 13) {

        ctrlAddItem();

    }

   });


    }




    var ctrlAddItem = function(){
//1. get the field input data

var input = UICtrl.getInput();


//2 add item to the budgetcontroller

//3  add item to the UI

//4 calculate the budget

// 5 display the budget in the UI


    };

    return {

        init: function(){
console.log('application is running');

setupEventListeners();

        }
    }

})(budgetController, UIController);

controller.init();
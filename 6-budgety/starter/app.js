// budget Controller
var budgetController = (function () {
   


})();
// UI controller
var UIController = (function () {



})();
// Global App Controller
var controller = (function (budgetCtrl, UICtrl) {
    
    var ctrlAddItem = function(){

console.log('it works');
    }

   document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
       


   document.addEventListener('keypress', function(event){

    console.log(event);

    if(event.Keycode === 13 || event.which === 13) {
        ctrlAddItem();

    }

   });

})(budgetController, UIController);
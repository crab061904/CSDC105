// const display=document.getElementById("Display");
// const number=document.getElementsByClassName("number")
// const operator=document.getElementsByClassName("operator")
// function appendToDisplay(input){
//  display.value+=input;
// }

// function clearDisplay(){
// display.value=" ";
// }

// function calculate(){
//     try{
//         display.value=eval(display.value);
//     }
//     catch{
//         display.value="Error";
//     }

// }

const display = document.getElementById("Display");
let lastInputWasOperator = false;
let calculationDone = false; // Track if `=` was pressed

function appendToDisplay(input) {
  if (!isNaN(input) || input === ".") {
    // If calculation was done and user tries to enter a number, show "Error"
    if (calculationDone) {
      display.value = "Error";
      return;
    }
    display.value += input;
    lastInputWasOperator = false;
  } else {
    // Allow operators even after pressing `=`
    if ((!lastInputWasOperator && display.value !== "") || calculationDone) {
      display.value += input;
      lastInputWasOperator = true;
      calculationDone = false; // Reset calculation state so numbers can be entered again
    }
  }
}

function clearDisplay() {
  display.value = "";
  lastInputWasOperator = false;
  calculationDone = false; // Reset state after clearing
}

function calculate() {
  try {
    display.value = eval(display.value);
    calculationDone = true; // Prevent entering new numbers after calculation
  } catch {
    display.value = "Error";
    calculationDone = true;
  }
}

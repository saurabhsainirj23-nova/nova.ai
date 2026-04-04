var prompt = require('prompt-sync')();
// 1. Even or Odd Checker
let num1 = parseInt(prompt("Enter a number:"));
if (num1 % 2 === 0) {
  console.log("Even");
} else {
  console.log("Odd");
}

// 2. Positive, Negative, or Zero
let num2 = parseInt(prompt("Enter a number:"));
if (num2 > 0) {
  console.log("Positive");
} else if (num2 < 0) {
  console.log("Negative");
} else {
  console.log("Zero");
}

// 3. Age-based Eligibility
let age = parseInt(prompt("Enter your age:"));
if (age >= 18) {
  console.log("Eligible to vote");
} else {
  console.log("Not eligible to vote");
}

// 4. Number Range Validator
let num3 = parseInt(prompt("Enter a number:"));
if (num3 >= 10 && num3 <= 20) {
  console.log("In range");
} else {
  console.log("Out of range");
}

// 5. Check Number Equality
let a = parseInt(prompt("Enter first number:"));
let b = parseInt(prompt("Enter second number:"));
if (a === b) {
  console.log("Both numbers are equal");
} else if (a > b) {
  console.log("First number is greater");
} else {
  console.log("Second number is greater");
}

// 6. Simple Grading System
let score = parseInt(prompt("Enter your score (0–100):"));
if (score >= 90) {
  console.log("Grade A");
} else if (score >= 75) {
  console.log("Grade B");
} else if (score >= 50) {
  console.log("Grade C");
} else {
  console.log("Fail");
}

// 7. Divisibility Checker (5 and 11)
let num4 = parseInt(prompt("Enter a number:"));
if (num4 % 5 === 0 && num4 % 11 === 0) {
  console.log("Divisible by both 5 and 11");
} else {
  console.log("Not divisible by both 5 and 11");
}

// 8. Find the Largest of Three Numbers
let x = parseInt(prompt("Enter first number:"));
let y = parseInt(prompt("Enter second number:"));
let z = parseInt(prompt("Enter third number:"));
if (x >= y && x >= z) {
  console.log("Largest number is: " + x);
} else if (y >= x && y >= z) {
  console.log("Largest number is: " + y);
} else {
  console.log("Largest number is: " + z);
}

// 9. Leap Year Validator
let year = parseInt(prompt("Enter a year:"));
if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
  console.log("Leap year");
} else {
  console.log("Not a leap year");
}

// 10. Vowel or Consonant
let ch = prompt("Enter a single alphabet character:").toLowerCase();
if (ch === 'a' || ch === 'e' || ch === 'i' || ch === 'o' || ch === 'u') {
  console.log("Vowel");
} else if (ch >= 'a' && ch <= 'z') {
  console.log("Consonant");
} else {
  console.log("Not a valid alphabet character");
}
function getRandom() {
  const random = Math.floor(Math.random() * 100) + 1
  console.log("Random number (1-100):", random)
  return random
}
getRandom()


function getSqrt(num) {
  const sqrt = Math.sqrt(num);
  console.log(`Square root of ${num}:`, sqrt)
  return sqrt
}

function roundValues(num) {
  const floor = Math.floor(num)
  const ceil = Math.ceil(num)
  const round = Math.round(num)
  console.log(`Floor: ${floor}, Ceil: ${ceil}, Round: ${round}`)
  return { floor, ceil, round }
}

getRandom()
getSqrt(49)
roundValues(4.7)

// 🕒 DATE QUESTIONS
const now = new Date()
document.getElementById("currentDateTime").innerText = "Current Date & Time: " + now
const year = now.getFullYear()
document.getElementById("currentYear").innerText = "Current Year: " + year

function daysLeftInYear() {
  const endOfYear = new Date(year, 11, 31)
  const diffInTime = endOfYear - now
  const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24))
  document.getElementById("daysLeft").innerText = "Days left in the year: " + diffInDays
  console.log("Days left in the year:", diffInDays)
  return diffInDays
}

daysLeftInYear()

// ⏱️ TIMER QUESTIONS
let count = 5
const countdown = setInterval(() => {
  console.log(count)
  count--
  if (count === 0) {
    clearInterval(countdown)
    console.log("Time’s up!")
  }
}, 1000)

setTimeout(() => {
  document.getElementById("welcomeMessage").innerText = "Welcome to JavaScript Practice!"
}, 2000);

document.getElementById("helloWorld").innerText = "Hello World"
document.getElementById("htmlInject").innerHTML = "<b>JavaScript is Fun</b>"

const techs = ["HTML", "CSS", "JS"]
let listHTML = "<ul>"
techs.forEach(item => {
  listHTML += `<li>${item}</li>`
});
listHTML += "</ul>"
document.getElementById("listContainer").innerHTML = listHTML

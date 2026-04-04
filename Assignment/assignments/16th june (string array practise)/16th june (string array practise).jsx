// STRING QUESTIONS

// 1. Reverse a String
function reverseString(str) {
  return str.split('').reverse().join('');
}
console.log("Reversed:", reverseString("hello")); 

// 2. Check Palindrome
function isPalindrome(str) {
  const cleaned = str.toLowerCase();
  return cleaned === cleaned.split('').reverse().join('');
}
console.log("Is Palindrome:", isPalindrome("Madam"));

// 3. Count Vowels
function countVowels(str) {
  const vowels = 'aeiouAEIOU';
  let count = 0;
  for (let char of str) {
    if (vowels.includes(char)) {
      count++;
    }
  }
  return count;
}
console.log("Vowel Count:", countVowels("JavaScript")); 

// 4. Capitalize First Letter of Each Word
function capitalizeWords(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
console.log("Capitalized:", capitalizeWords("hello world"));

// 5. Character Frequency
function charFrequency(str) {
  const freq = {};
  for (let char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return freq;
}
console.log("Character Frequency:", charFrequency("aabbbc"));


// ARRAY QUESTIONS

// 1. Remove Duplicates
function removeDuplicates(arr) {
  return [...new Set(arr)];
}
console.log("No Duplicates:", removeDuplicates([1, 2, 2, 3, 4, 4]));

// 2. Flatten an Array (1 level deep)
function flattenArray(arr) {
  return arr.flat();
}
console.log("Flattened:", flattenArray([[1, 2], [3, 4], [5]]));

// 3. Find Max and Min
function findMaxMin(arr) {
  return {
    max: Math.max(...arr),
    min: Math.min(...arr)
  };
}
console.log("Max & Min:", findMaxMin([4, 1, 9, -2]));

// 4. Sum of Even Numbers
function sumEven(arr) {
  return arr
    .filter(num => num % 2 === 0) 
    .reduce((sum, num) => sum + num, 0);
}
console.log("Sum of Even Numbers:", sumEven([1, 2, 3, 4, 5, 6]));

// 5. Group by Type
function groupByType(arr) {
  const grouped = {};
  for (let item of arr) {
    let type = typeof item;
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(item);
  }
  return grouped;
}
console.log("Grouped by Type:", groupByType([1, 'a', true, 2, 'b']));

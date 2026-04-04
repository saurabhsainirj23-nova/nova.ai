//Q1. What is the purpose of the fs module in Node.js?
//The fs module in Node.js allows you to interact with the file system — reading, writing, updating, deleting, and checking file stats. 
//It provides both asynchronous (non-blocking) and synchronous (blocking) methods.


//Q2. Write a program to read the contents of a file called hello.txt using fs.readFile?
//const fs = require('fs');
//fs.readFile('hello.txt', 'utf8', (err, data) => {
//if (err) return console.error('Error reading file:', err);
//console.log('File content:', data);
//});





//Q3. How can you write "Hello World" into a file output.txt using fs.writeFile?
//const fs = require('fs');
// fs.writeFile('output.txt', 'Hello World', (err) => {
//   if (err) throw err;
//   console.log('File written successfully!');
// });
//});




//Q4. What is the difference between fs.readFile and fs.readFileSync?


//fs.readFile (Asynchronous)
//• fs.readFile is asynchronous, which means it doesn’t block the execution of the rest of your code.
//• When you use it, Node.js will start reading the file and immediately continue running the next lines of code, without waiting for the file to finish reading.
//• You pass a callback function that will be called once the file has been read (or if an error occurs).
//• This is useful in web servers or any app where blocking the code could slow things down.





//fs.readFileSync (Synchronous)
//• fs.readFileSync is synchronous, meaning it blocks the execution of all other code until the file has been completely read.
//• It returns the file content directly, so no callback is used.
//• This is simpler for short scripts or setup code where blocking is okay, but it's not recommended in performance-critical applications.






//Q5. Use fs.appendFile to add "Appended Text" to an existing file log.txt?
//const fs = require('fs');
//fs.appendFile('log.txt', '\nAppended Text', (err) => {
//  if (err) throw err;
//  console.log('Text appended!');






//⚙️ Intermediate Level
//Q6. Write a Node.js script to copy the contents of one file to another.
//const fs = require('fs');

//fs.readFile('source.txt', 'utf8', (err, data) => {
//  if (err) throw err;
//  fs.writeFile('destination.txt', data, (err) => {
//    if (err) throw err;
//    console.log('File copied successfully!');
//  });
//});





//Q7. Check if a file data.json exists or not using fs.existsSync.
//const fs = require('fs');

//if (fs.existsSync('data.json')) {
//  console.log('data.json exists');
//} else {
//  console.log('data.json does not exist');
//}





//Q8. How do you delete a file named deleteMe.txt using fs.unlink?
//const fs = require('fs');

//fs.unlink('deleteMe.txt', (err) => {
//  if (err) return console.error('Error deleting file:', err);
//  console.log('deleteMe.txt deleted!');
//});






//Q9. Create a directory myFolder if it doesn’t already exist.
//const fs = require('fs');

//if (!fs.existsSync('myFolder')) {
//  fs.mkdirSync('myFolder');
//  console.log('Directory created!');
//} else {
//  console.log('Directory already exists.');
//}





//Q10. How do you read all files inside a folder using fs.readdir?

//const fs = require('fs');

//fs.readdir('./myFolder', (err, files) => {
//  if (err) throw err;
//  console.log('Files in folder:', files);
//});






//Q11.write a code to create tables of 1-10 in seperate files using fs and loop?
//const fs = require('fs');

//for (let i = 1; i <= 10; i++) {
//  let table = '';
//  for (let j = 1; j <= 10; j++) {
//    table += `${i} x ${j} = ${i * j}\n`;
//  }

//  fs.writeFile(`table-${i}.txt`, table, (err) => {
//    if (err) throw err;
//    console.log(`Table of ${i} created.`);
//  });
//}






//Q12.make a json file with {"username":"abc" , password:123} credentials and ask user for there user name and password and check authentication and show msg correspondingly.
//const fs = require('fs');
//const readline = require('readline');

// Create the JSON file (only once)
//const credentials = { username: "abc", password: 123 };
//fs.writeFileSync('user.json', JSON.stringify(credentials));

// CLI input
//const rl = readline.createInterface({
//  input: process.stdin,
//  output: process.stdout
//});

//rl.question("Enter username: ", (username) => {
//  rl.question("Enter password: ", (password) => {
//    const saved = JSON.parse(fs.readFileSync('user.json', 'utf8'));
    
//    if (username === saved.username && parseInt(password) === saved.password) {
//      console.log("✅ Authentication successful");
//    } else {
//      console.log("❌ Invalid credentials");
//    }
//    rl.close();
//  });
//});



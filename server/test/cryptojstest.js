const CryptoJS = require("crypto-js");

// const testData = [
//   {
//     age: 22,
//     name: "Abiskar",
//   },
//   {
//     age: 22,
//     name: "Abiskar"
//   },
// ];

// const messageDigest = CryptoJS.HmacSHA1(
//   JSON.stringify(testData[0]),
//   "test123"
// ).toString();

// const msgd = CryptoJS.HmacSHA1(
//   JSON.stringify(testData[1]),
//   "test123"
// ).toString();

// if (messageDigest === msgd) {
//   console.log("The digest are same ");
// } else {
//   console.log("Failed");
// }

// const secretKey = CryptoJS.enc.Utf8.parse("test123")


// CryptoJS.AES.decrypt()

// const sha1 = CryptoJS.SHA1("hello")
// console.log(sha1)
const mysqlString = require('sqlstring');

const insertObject = {
    username:"Abiskar",
    email:"abiskar@gmail.com",
    password: "Test@123"
};

const value = 12
const table = ["users"]
const name = "Hello I am abiskar"

const query = mysqlString.format("INSERT INTO ?? SET ?",[table,insertObject]);
const query2 = `UPDATE users SET username = ` + mysqlString.escape(name)
console.log(query2)
const username = "Abiskar"
const query3 = mysqlString.format(`UPDATE ?? SET username = ${mysqlString.escape(username)}`,[["users"]]);
console.log(query3)

let queryStr4 = "UPDATE ?? SET ";

queryStr4 += `username = ? `;
queryStr4 += `, email = ?`;

let query4 = mysqlString.format(queryStr4,[['users'],"Abiskar","abinjr08@gmail.com"])

console.log(query4)
const testLine = "New code test line"
console.log(testLine)
let newQuery = mysqlString.format("DROP table ??",[['hello']]);
console.log(newQuery)

const createHash = (message,key) =>{

    try {
        const data = Buffer.from(JSON.stringify(message)).toString('base64');
        console.log(atob(data))
        const hashedStr = CryptoJS.HmacSHA256(data,key).toString(CryptoJS.enc.Hex);
        console.log(hashedStr)
    } catch (error) {
        console.log(error)
    }
}

createHash("Abiskar","key")
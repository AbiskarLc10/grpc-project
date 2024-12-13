// const sequelize = require("../db/connection");
// const {v4:uuidv4} = require('uuid')
// const bcrypt = require('bcrypt')
// // const getData = async (limit,offset) =>{
// //     try {

// //         const users = await sequelize.query("SELECT * FROM authors limit ? offset ?",{
// //             replacements: [
// //                 limit,
// //                 offset
// //             ]
// //         });

// //         console.log(users);

// //         return users;

// //     } catch (error) {
// //         console.log(error)
// //     }
// // }

// const InsertSetQuery = async (data) => {
//     try {
//       const [_,affectedRow] = await sequelize.query(
//         "INSERT into authors SET id= :id,name= :name,email= :email,password= :password,genre= :genre,date_of_birth=:dob",
//         {
//           replacements: data,
//         }
//       );

//       console.log(affectedRow);
//     // const deleteUsers = await sequelize.query("DELETE FROM authors WHERE email=?",{
//     //     replacements: [
//     //         data.email
//     //     ]
//     // });
//     //   console.log(deleteUsers)
//     } catch (error) {
//       console.error("Error inserting data into authors table:", error.message);
//     }
//   };
  
// ( async ()=>{
// InsertSetQuery({
//     id: uuidv4(),
//     name: "Rabindra1",
//     email: "rabin12345@gmail.com",
//     password: await bcrypt.hash("rabin@1234",10),
//     genre: "FANTASY",
//     dob: new Date("2003/09/12").toISOString(),
//   }) })()
// // getData(2,2);


class UserData {

  static USER1 = new UserData("Abiskar");

  constructor(name){
    this.name = name;

  }

  toString(){
    return `UserData.${this.name}`;
  }
}

console.log(UserData.USER1);
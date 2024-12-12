const sequelize = require("../db/connection");
const {v4:uuidv4} = require('uuid')
// const getData = async (limit,offset) =>{
//     try {

//         const users = await sequelize.query("SELECT * FROM authors limit ? offset ?",{
//             replacements: [
//                 limit,
//                 offset
//             ]
//         });

//         console.log(users);

//         return users;

//     } catch (error) {
//         console.log(error)
//     }
// }

const InsertSetQuery = async (data) => {
    try {
      const res = await sequelize.query(
        "INSERT into authors SET id= :id,name= :name,email= :email,password= :password,genre= :genre,date_of_birth=:dob,createdAt=:createdAt,updatedAt= :updatedAt",
        {
          replacements: data,
        }
      );

    // const deleteUsers = await sequelize.query("DELETE FROM authors WHERE email=?",{
    //     replacements: [
    //         data.email
    //     ]
    // });
    //   console.log(deleteUsers)
    } catch (error) {
      console.error("Error inserting data into authors table:", error.message);
      console.error(error.stack);
      throw error;
    }
  };
  

InsertSetQuery({
    id: uuidv4(),
    name: "Rabindra",
    email: "rabin1234@gmail.com",
    password: "Rabin@1234",
    genre: "FANTASY",
    dob: new Date("2003/09/12").toISOString(),
    createdAt: new Date(),
    updatedAt: new Date()
  })
// getData(2,2);

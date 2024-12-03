const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
require("dotenv").config();


app.use(express.json());
app.get("/", async (req,res)=>{

    return res.send("Hello");
})

app.listen(port,()=>{
    console.log(`Listening at port ${port}`)
})
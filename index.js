

const { MongoClient } = require("mongodb");
const uri ="mongodb+srv://Akanksha:Maniyari@cluster0.0muw2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true,useUnifiedTopology:true});
function getCollection() {
  return new Promise((resolve, reject) => {
    client.connect((err) => {
      if (!err) {
        const collection = client.db("test").collection("devices");
        resolve(collection);
      } else {
        reject(err);
      }
    });
  });
}
module.exports = {
    getCollection
}


const express = require('express')
const app = express()
const port = 8080
const {getCollection} = require('./dbConnection');
app.get("/",async(req,res)=>{
    const collection = await getCollection();
    const userData = await collection.find().toArray();
    res.json(userData);
})
app.listen(port, ()=>{
    console.log("server is running on port " + port)
})


console.log("*********************************************************")

const { MongoClient } = require("mongodb");
const uri ="mongodb+srv://Akanksha:Maniyari@cluster0.0muw2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true,useUnifiedTopology:true});
function getCollection() {
  return new Promise((resolve, reject) => {
    client.connect((err) => {
      if (!err) {
        const collection = client.db("test").collection("devices");
        resolve(collection);
      } else {
        reject(err);
      }
    });
  });
}
module.exports = {
    getCollection
}

const express = require('express')
const app = express()
const port = 8080
const {getCollection} = require('./dbConnection');
app.set("view engine","ejs")
app.get("/",async(req,res)=>{
    const collection = await getCollection();
    const userData = await collection.find().toArray();
    res.render("index.ejs",{users : userData})
})
app.listen(port, ()=>{
    console.log("server is running on port " + port)
})


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Ejs file</h1>
    <ol>
        <% for(var i = 0; i< users.length; i++){ %>
            <li> <%= users[i].name %> </li>
      <%  } %>
    </ol>
</body>
</html>







const express = require('express')
const app = express()
const port = 8080

const userRoutes = require('./views/userRoutes');
app.use(express.json());
app.use(userRoutes);

app.use("*",(req,res)=>{
    res.status(404).json("Not found")
})
app.listen(port, ()=>{
    console.log("server is running on port " + port)
})


const { MongoClient } = require("mongodb");
const uri ="mongodb+srv://Akanksha:Maniyari@cluster0.0muw2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true,useUnifiedTopology:true});
function getCollection() {
  return new Promise((resolve, reject) => {
    client.connect((err) => {
      if (!err) {
        const collection = client.db("test").collection("devices");
        resolve(collection);
      } else {
        reject(err);
      }
    });
  });
}
module.exports = {
    getCollection
}



const express = require('express')
const router = express.Router();
const {ObjectId} = require("mongodb")
const {getCollection} = require('../dbConnection');

router.get("/getUser",async(req,res)=>{
    const collection = await getCollection();
    const userData = await collection.find().toArray();
    res.json(userData);
})

router.get("/getUsers/:id",async(req,res)=>{
    const collection = await getCollection();
    try{
        const user = await collection.findOne({_id: ObjectId(req.params.id)})
      return  res.json(user)
    }catch(err){
        res.status(404).json({Error : "user not found with this id "})
    }
})

// router.post("/registerUsers",async(req,res)=>{
//     const collection = await getCollection();
//     const result = await collection.insertOne(req.body);
//     res.json(result)
// })

router.post("/registerUsers",async(req,res)=>{
    const {name, email, password, confirmPassword} = req.body;

    if(!name || !email || !password || !confirmPassword){
        return res.status(206).json({Error : "field missing "});
    }else{
        if(password != confirmPassword){
            return res.status(417).json({Error : "password and confirmPassword do not match"});
        }else{
            const collection = await getCollection();
            try {
                const result = await collection.insertOne(name,email,password);
                res.status(201).json({succss : "user registered"})
            } catch (error) {
                res.json(error);
            }    
        }    
    } 
})

router.put("/updateUsers/:userId",async(req,res)=>{
    const collection = await getCollection();
    try{
        const result = await collection.update({_id : ObjectId(req.params.userId)}, {$set : req.body}) 
        return res.json(result)
    }catch(err){
        return res.status(404).json({Error : "no user found with this id "})
    }
})

router.delete("/deleteUser/:id",async(req,res)=>{
    const collection = await getCollection();
    try{
        const result = await collection.deleteOne({_id : ObjectId(req.params.id)})
        if(result.deletedCount == 0){
            return res.status(404).json({Error : "no user found with this id "})
        }
        return res.json(result)
    }catch(err){
        res.json(err);
    }
})


module.exports = router;
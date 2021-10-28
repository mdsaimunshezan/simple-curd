const express = require("express");
const { MongoClient } = require('mongodb');
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()

const app = express();


const port = process.env.PORT || 5000;

//USE MIDDLEWAIR
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.agzd1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const run = async ()=>{
    try{
        await client.connect();
        const database = client.db("crud");
        const crudCollection = database.collection("users")

        //GET API
        app.get("/users", async(req,res)=>{
            const cursor = crudCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get("/users/:id", async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await crudCollection.findOne(query);
            console.log(result)
            res.send(result)
        })



        //POST API
        app.post("/users", async(req,res)=>{
            const user = req.body;
            const result = await crudCollection.insertOne(user);
            res.json(result);

        })

        //UPDATE API
        app.put("/users/:id", async(req,res)=>{
            const id = req.params.id;
            const updateUser = req.body;
            console.log(updateUser)
           
            const filter = {_id:ObjectId(id)}
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  name: updateUser.name,
                  email:updateUser.email
                },
              };

              const result = await crudCollection.updateOne(filter, updateDoc, options);
              console.log("update",result)
              res.send(result)
              
          
        })
        
        //DELETE API
        app.delete("/users/:id", async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await crudCollection.deleteOne(query);
            res.json(result)
        })
        
    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir)







//USE ROUTE
app.get("/",(req,res)=>{
    res.send("this is home page current raning");
})






//CREAT SERVER
app.listen(port,()=>{
    console.log("port is ranign on the port",port);
})

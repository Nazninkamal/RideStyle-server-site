const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 4000;
;

//middelware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.orb6q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      //console.log('connected to the database')
      const database = client.db("assignment12");
      const servicesCollection = database.collection("services");
      const usersCollection = database.collection("users");
      const reviewCollection = database.collection("review");
      
      //get api
      app.get('/services', async(req, res)=>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
      })
      app.get('/users', async(req, res)=>{
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.send(users);
      })
      app.get('/review', async(req, res)=>{
        const cursor = reviewCollection.find({});
        const review = await cursor.toArray();
        res.send(review);
      })

      //get single service
      app.get('/services/:id', async(req, res) =>{
        const id = req.params.id;
        console.log('getting specific service', id)
        const query = {_id: ObjectId(id)};
        const service = await servicesCollection.findOne(query);
        res.json(service);
      })

      //Post api
      app.post('/services', async(req, res)=>{
        const service = req.body;
         console.log('hit the post api', service);

         const result = await servicesCollection.insertOne(service);
         console.log(result);
         res.json(result)
      
        }) ;

        app.post('/users', async(req, res)=>{
          const user = req.body;
           console.log('hit the post api', user);
  
           const result = await usersCollection.insertOne(user);
           console.log(result);
           res.json(result)
        
          }) ;
          app.post('/review', async(req, res)=>{
            const review = req.body;
             console.log('hit the post api', review);
    
             const result = await reviewCollection.insertOne(review);
             console.log(result);
             res.json(result)
          
            }) ;


        // delete api
        app.delete('/users/:id',async(req, res)=>{
          const id = req.params.id;
          const query = {_id:ObjectId}
          const result = await usersCollection.deleteOne(query);
          res.json(result);
        })

    } 
    
    finally {
      //await client.close();
    }
  }

  run().catch(console.dir);

      

app.get('/', (req, res) => {
  res.send('Assignment 12');
});

app.listen(port, () => {
  console.log('Running Genius Server on port',port)
})
const express=require('express');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT||5000;
require('dotenv').config()
const app=express()
// midlewire
app.use(cors());
app.use(express.json());
// user:carHat
// pass:ODzOPDZLsoV9ajGD


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ob3f1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
  try{
      await client.connect();
      const serviceCollection=client.db("CarHat").collection("services");
      const orderCollection=client.db("car_Hat").collection("order");
      // data reading/load
      app.get('/service',async(req,res)=>{
        const query={};
        const cursor=serviceCollection.find(query);
        const service=await cursor.toArray();
        res.send(service)
      })
      // find a specefeic user 
      app.get('/service/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const service=await serviceCollection.findOne(query);
        res.send(service)
      })
      // send a data to server/mongodb
      app.post('/service',async(req,res)=>{
        const newService=req.body;
        const result=await serviceCollection.insertOne(newService);
        res.send(result)
      })
      // delete from server/mongodb
      app.delete('/service/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const result=await serviceCollection.deleteOne(query);
        res.send(result)

      })

      // create a place oredr
      app.post('/order',async(req,res)=>{
        const order=req.body;
        const result=await orderCollection.insertOne(order);
        console.log(result)
        res.send(result)
      });

      //get data by order page
      app.get('/order',async(req,res)=>{
        const email=req.query.email;
        const query={email};
        const orders=orderCollection.find(query);
        const result=await orders.toArray();
        res.send(result)
      })
      // jwt api create
      app.post('/login',async(req,res)=>{
        const user=req.body;
        const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN,{
          expiresIn:'5h'
        });
        res.send({accessToken})
      })

  }
  finally{

  }
}
run().catch(console.dir)


app.get('/',(req,res)=>{
    res.send('server is ready for car-hat')
})

app.listen(port,()=>{
    console.log('i am listening',port)
})
const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o0npkhl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });



  async function run() {
    try {
      await client.connect();
      const coffeesDB = await client.db("CraftGlowDB").collection("Items");
      app.post("/added", async (req, res) => {
        const result = await coffeesDB.insertOne(req.body);
        res.send(result);
      });
      app.get("/added", async (req, res) => {
        const result = await coffeesDB.find().toArray();
        res.send(result);
      });
      app.get("/added/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const result = await coffeesDB.find(query).toArray();
        res.send(result);
      });
      await client.db("admin").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } finally {
    }
  }
  run().catch(console.dir);



  
app.get("/", (req, res) => {
    res.send("Welcome To CraftGlow Server Side!");
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
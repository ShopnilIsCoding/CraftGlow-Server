const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true 
}));

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
        const CraftGlowDB = client.db("CraftGlowDB").collection("Items");
        const AnotherDB = client.db("CraftGlowDB").collection("Categories");

        app.post("/added", async (req, res) => {
            const result = await CraftGlowDB.insertOne(req.body);
            res.send(result);
        });

        app.get("/added", async (req, res) => {
            const result = await CraftGlowDB.find().toArray();
            res.send(result);
        });

        app.get("/added/:email", async (req, res) => {
            const result = await CraftGlowDB.find({ email: req.params.email }).toArray();
            res.send(result);
        });

        app.get("/details/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await CraftGlowDB.findOne(query);
            res.send(result);
        });

        app.delete("/delete/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await CraftGlowDB.deleteOne(query);
            res.send(result);
        });

        app.patch('/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const result = await CraftGlowDB.updateOne(filter, { $set: req.body }, options);
            res.send(result);
        });

        app.get("/item/categories", async (req, res) => {
            const result = await AnotherDB.find().toArray();
            res.send(result);
        });

        app.get("/item/categories/:subcategory", async (req, res) => {
            const subcategory = req.params.subcategory;
            const query = { category: subcategory };
            const result = await CraftGlowDB.find(query).toArray();
            res.send(result);
        });

        
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        
    }
}

run().catch(console.error);

app.get("/", (req, res) => {
    res.send("Welcome To CraftGlow Server Side!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

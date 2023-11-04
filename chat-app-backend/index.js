const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://antoniosegurarojas:MpjrtVyscT6KD1Pa@cluster0.dfe5x83.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    const db = client.db('Cluster0'); // Replace <dbname> with your actual database name.
    const chatCollection = db.collection('chat');

    app.post('/api/messages', async (req, res) => {
      try {
        // Construct a new message object with the current date and time
        const newMessage = {
          username: req.body.username,
          content: req.body.content,
          createdAt: new Date()
        };

        // Insert the new message into the database
        const result = await chatCollection.insertOne(newMessage);

        // Respond with the inserted document (including the MongoDB-generated ID)
        res.status(201).json(result.ops[0]);
      } catch (error) {
        console.error("Error during MongoDB insert operation", error);
        res.status(400).send(error.message);
      }
    });

    app.get('/api/messages', async (req, res) => {
      try {
        // Connect to the database if not already connected
        await client.connect();
        // Access the database and collection
        const db = client.db('Cluster0'); // Replace <dbname> with your actual database name.
        const chatCollection = db.collection('chat');
    
        // Fetch and sort the messages from the collection
        const messages = await chatCollection.find().sort({ createdAt: 1 }).toArray(); // `1` for ascending order
    
        res.json(messages);
      } catch (error) {
        console.error("Error fetching messages", error);
        res.status(500).send(error.message);
      }
    });
    


   app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (e) {
    console.error("Error during MongoDB client initialization", e);
  }
}

run().catch(console.dir);


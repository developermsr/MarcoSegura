const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());


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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



// Define a schema for chat messages
const MessageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create a model from the schema
const Message = mongoose.model('Message', MessageSchema);

app.use(express.json());

// Unified POST endpoint for messages
app.post('/api/messages', async (req, res) => {
  try {
    let message = new Message({
      username: req.body.username,
      content: req.body.content // Asegúrate de que esto coincida con tu esquema y la petición del cliente.
    });
    message = await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(400).send(error);
  }
});


app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 'asc' }); // Ordenados por fecha de creación
    res.json(messages);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

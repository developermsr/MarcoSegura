const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

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

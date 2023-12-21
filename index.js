const express = require("express");
const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ufgx0zu.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const tasksCollection = client.db("task-managementDB").collection("tasks");

    // Tasks
    app.post("/tasks", async (req, res) => {
      try {
        const newTask = req.body;
        if (!newTask) {
          res.status(400).send;
        }
        const result = await tasksCollection.insertOne(newTask);
        res.send(result);
      } catch (err) {
        if (err) {
          res.status(400).send;
        }
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("TASK MANAGEMENT SERVER IS RUNNING");
});

app.listen(port, () => {
  console.log("The server is running on port:", port);
});

const express = require("express");
const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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

    app.get("/tasks", async (req, res) => {
      try {
        const email = req.query.email;
        let query = {};
        if (email) {
          query.userEmail = email;
        }

        const result = await tasksCollection.find(query).toArray();
        res.send(result);
      } catch (err) {
        res.status(400).send;
      }
    });

    app.get("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await tasksCollection.findOne(query);
        res.send(result);
      } catch (err) {
        res.status.send(400);
      }
    });

    app.delete("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await tasksCollection.deleteOne(query);
        res.send(result);
      } catch (err) {
        res.status.send(400);
      }
    });

    app.patch("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const updatedTask = req.body;

      const filter = { _id: new ObjectId(id) };

      const updatedDoc = {
        $set: {
          title: updatedTask?.title,
          description: updatedTask?.description,
          priority: updatedTask?.title,
          date: updatedTask?.date,
        },
      };

      const result = await tasksCollection.updateOne(filter, updatedDoc);
      res.send(result);
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

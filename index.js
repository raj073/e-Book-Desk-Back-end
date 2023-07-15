const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();

require("dotenv").config();

const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mlxaon5.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    const db = client.db("eBookDesk");

    const bookCollection = db.collection("book");

    app.post("/addbook", async (req, res) => {
      const book = req.body;
      console.log(book);

      const result = await bookCollection.insertOne(book);
      res.send(result);
    });
  } finally {
  }
};

run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("e-Book Desk Server is Running");
});

app.listen(port, () => {
  console.log(`e-Book Desk Server is Running on ${port}`);
});

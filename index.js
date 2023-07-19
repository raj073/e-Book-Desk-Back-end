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

      const result = await bookCollection.insertOne(book);
      res.send(result);
    });

    app.get("/books", async (req, res) => {
      const cursor = bookCollection.find({});
      const book = await cursor.toArray();
      res.send({ data: book });
    });

    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const result = await bookCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.put("/book/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      const result = await bookCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );

      if (result.modifiedCount !== 1) {
        console.error("Book not found or Book not added");
        res.json({ error: "Book not found or Book not added" });
        return;
      }

      console.log("Book Updated successfully");
      res.json({ message: "Book Updated successfully" });
    });

    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;

      const result = await bookCollection.deleteOne({ _id: new ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.post("/review/:id", async (req, res) => {
      const bookId = req.params.id;
      const { review, reviewedBy } = req.body;

      const result = await bookCollection.updateOne(
        { _id: new ObjectId(bookId) },
        { $push: { reviews: review, reviewedBy: reviewedBy } }
      );

      if (result.modifiedCount !== 1) {
        console.error("Review not Found or Review Not Added");
        res.json({ error: "Review not Found or Review Not Added" });
        return;
      }

      console.log("Review added successfully");
      res.json({ message: "Review added successfully" });
    });

    app.get("/review/:id", async (req, res) => {
      const bookId = req.params.id;

      const result = await bookCollection.findOne(
        {
          _id: new ObjectId(bookId),
        },
        { projection: { _id: 0, reviews: 1 } }
      );

      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: "Book Not Found" });
      }
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

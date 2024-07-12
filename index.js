const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const userName = process.env.USER_NAME;
const key = process.env.SECRET_KEY;
const uri = `mongodb+srv://${userName}:${key}@cluster0.ch266hd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let client;
let foodCollection;
let chefsCollection;
let reviewCollection;
let subscriberCollection;
let reservationCollection;

async function connectToMongoDB() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        serverSelectionTimeoutMS: 5000,
      },
    });
    await client.connect();

    const foodDb = client.db("foodMenu");
    const chefsDb = client.db("chefData");
    const reservationDb = client.db("reservation");
    const reviewDb = client.db("userReview");
    const subscriptionDb = client.db("subscription");

    foodCollection = foodDb.collection("foods");
    chefsCollection = chefsDb.collection("chefs");
    reservationCollection = reservationDb.collection("booking");
    reviewCollection = reviewDb.collection("review");
    subscriberCollection = subscriptionDb.collection("subscriber");
  }
}
// food routes
app.get("/foods", async (req, res) => {
  try {
    const foods = await foodCollection.find().toArray();
    res.send(foods);
  } catch (error) {
    console.error("Error occurred while getting foods:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// chef routes
app.get("/chefs", async (req, res) => {
  try {
    const chefs = await chefsCollection.find().toArray();
    res.send(chefs);
  } catch (error) {
    console.error("Error occurred while getting users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// review routes
app.get("/review", async (req, res) => {
  try {
    const review = await reviewCollection.find().toArray();
    res.send(review);
  } catch (error) {
    console.error("Error occurred while getting users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// booking table
app.post("/booking", async (req, res) => {
  try {
    const data = req.body;
    const result = await reservationCollection.insertOne(data);
    res.send(result);
  } catch (error) {
    console.error("Error occurred while inserting food:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// subscribe route
app.post("/subscribe", async (req, res) => {
  try {
    const data = req.body;
    const result = await subscriberCollection.insertOne(data);
    res.send(result);
  } catch (error) {
    console.error("Error occurred while inserting food:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// default route
app.get("/", (req, res) => {
  res.send("Restaurant Server is Running!");
});

// Start the server after ensuring database connection
async function startServer() {
  await connectToMongoDB();
  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
}
// module.exports = async (req, res) => {
//   await connectToMongoDB();
//   app(req, res);
//   app.listen(port, () => {
//     console.log(`Listening on port: ${port}`);
//   });
// };
startServer().catch(console.error);

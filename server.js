const express = require("express"); // Fix import statement
const { connect } = require("mongoose"); // Correct the import statement for mongoose
const { MongoClient } = require("mongodb");
const PORT = process.env.PORT || 8000;
const app = express();

const articlesInfo = {
  "learn-react": {
    comments: [],
  },
  "learn-node": {
    comments: [],
  },
  "my-thoughts-on-learning-react": {
    comments: [],
  },
};

const mongodb = async () => {
  try {
    await connect("mongodb://localhost:27017/mernblog");
    console.log("db connected");
  } catch (error) {
    const { status, message } = error;
    console.log(status, message);
  }
};

app.use(express.json({ extended: false }));

const withDB = async (operations, res) => {
  try {
    const client = await MongoClient.connect("mongodb://localhost:27017");
    const db = client.db("mernblog");
    await operations(db);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error connecting to database", error });
  }
};

app.get("/api/articles/:name", async (req, res) => {
  withDB(async (db) => {
    const articleName = req.params.name;

    const articlesInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    res.status(200).json(articlesInfo);
  }, res);
});

app.post("/api/articles/:name/add-comments", (req, res) => {
  const { username, text } = req.body;
  const articleName = req.params.name;

  withDB(async (db) => {
    const articlesInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    console.log({ articlesInfo });
    if (articlesInfo)
      await db.collection("articles").updateOne(
        { name: articleName },
        {
          $set: {
            comments: articlesInfo.comments.concat({ username, text }),
          },
        }
      );
    const updateArticleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    res.status(200).json(updateArticleInfo);
  }, res);
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
  mongodb(); // Call mongodb function
});

const express = require("express");
const assert = require('assert');
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;


// Setup expressJS
const app = express();

//Body Parser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// Connection URL
const url = 'mongodb://admin:admin123@ds241968.mlab.com:41968/votecast';
// Database Name
const dbName = 'votecast';
// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

// Use connect method to connect to the Server
client.connect((err, dbo) => {
    if (err) {
        return null;
    }
    const db = dbo.db(dbName);
    app.locals.db = db;
})

// Import routes
const votes = require("./routes/api");
// Use routes
app.use("/api", votes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on ${port}`));
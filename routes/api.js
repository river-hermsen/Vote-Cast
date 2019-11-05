const express = require("express");
const router = express.Router();
var MongoDBObjectID = require('mongodb').ObjectID;

// Load input validation
const validateNewVote = require("../validation/newVote");





// @router  POST /api
// @desc    Create a new vote
router.post("/", (req, res) => {
    // Validate users input
    const { errors, isValid } = validateNewVote(req.body);
    // Check if users input is correct
    if (!isValid) {
        return res.status(400).json(errors);
    }


    const question = req.body.question;
    const optionsArray = req.body.options;

    const db = req.app.locals.db;
    // Check if successfully connected to database
    if (!db) {
        return res.sendStatus(400);
    }

    // Insert new vote in database
    db.collection('votes').insertOne({ question, optionsArray }, function (err, result) {
        // Check if a document has been inserted and if there are no errors
        if (result.insertedCount == 1 && err === null) {
            return res.sendStatus(200);
        } else {
            errors.push("Something went wrong. Please try again later.")
            return res.sendStatus(400);
        }
    });
});

// @router  GET /api
// @desc    Read a vote
router.get("/", (req, res) => {
    const voteId = req.body.voteId;

    const db = req.app.locals.db;
    // Check if successfully connected to database
    if (!db) {
        return res.sendStatus(400);
    }

    // Find a vote by given vote id
    db.collection("votes").findOne({ _id: new MongoDBObjectID(voteId) }, function (err, result) {
        // Check if a document has been given and if there are no errors
        if (!err && result) {
            return res.status(200).json(result);
        } else {
            errors.push("Something went wrong. Please try again later.")
            return res.send(400).json(errors);
        }
    });
});

// @router  POST /api/vote
// @desc    Vote on a vote
router.post("/vote", (req, res) => {
    const voteId = req.body.voteId;
    const voteOption = req.body.voteOption;

    const db = req.app.locals.db;
    // Check if successfully connected to database
    if (!db) {
        return res.sendStatus(400);
    }

    // Increase the voteoption using voteid and voteoption given by user
    db.collection("votes").updateOne({ _id: new MongoDBObjectID(voteId) }, { $inc: { ["optionsArray." + voteOption + ".amountVotes"]: 1 } }, function (err, result) {
        // Check if a document has been modified and if there are no errors
        if (!err && result.modifiedCount !== 0) {
            return res.sendStatus(200);
        } else {
            errors.push("Something went wrong. Please try again later.")
            return res.send(400).json(errors);
        }
    })
});


module.exports = router;

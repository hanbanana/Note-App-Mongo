var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require('body-parser');
var logger = require('morgan');


var app = express()

app.use(bodyParser.urlencoded({ extended: false }))



app.use(express.static("public"));

app.use(logger("dev"));


//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.

//(Focus on This Variable)
var url = 'mongodb://heroku_k4npvtj3:rl8uap6in70hc9bv41u73vgvqt@ds151066.mlab.com:51066/heroku_k4npvtj3';      
//(Focus on This Variable)

// Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);

    // do some work here with the database.

    //Close connection
    db.close();
  }
});


var databaseUrl = "notetaker_mongo";
var collections = ["notes"];

var db = mongojs(databaseUrl, collections);

db.on("error", function (error) {
    console.log("Database Error: ", error);
});


app.get('/', function (req, res) {
    res.send(index.html);
});

app.post("/submit", function (req, res) {
    console.log(req.body);
    db.notes.insert(req.body, function (error, saved) {
        if (error) {
            console.log(error);
        }
        else {
            res.send(saved);
        }
    });
});

app.get("/all", function (req, res) {
    console.log(req.body);
    db.notes.find({}, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.send(found);
        }
    });
});

app.get("/find/:id", function (req, res) {
    db.notes.findOne(
        {
      _id: mongojs.ObjectId(req.params.id)
        },
        function (error, found) {
            if (error) {
                console.log(error);
                res.send(error);
            }
            else {
                console.log(found);
                res.send(found);
            }
        }
    );
});

app.post("/update/:id", function (req, res) {
    db.notes.update(
        {
            _id: mongojs.ObjectId(req.params.id)
        },
        {
            $set: {
                title: req.body.title,
                note: req.body.note,
                modified: Date()
            }
        },
        function (error, edited) {
            if (error) {
                console.log(error);
                res.send(error);
            }
            else {
                console.log(edited);
                res.send(edited);
            }
        }
    );
});

app.get("/delete/:id", function (req, res) {

    db.notes.remove(
        {
          _id: mongojs.ObjectID(req.params.id)
        },
        function (error, removed) {
            if (error) {
                console.log(error);
                res.send(error);
            }
            else {
                console.log(removed);
                res.send(removed);
            }
        }
    );
});

app.get("/clearall", function (req, res) {
    
    db.notes.remove({}, function (error, response) {
        if (error) {
            console.log(error);
            res.send(error);
        }
        else {
            console.log(response);
            res.send(response);
        }
    });
});


app.listen(3000, function() {
    console.log("App running on port 3000!");
  });
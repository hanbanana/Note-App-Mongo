var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require('body-parser')
var logger = require('morgan')

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))



app.use(express.static("public"));

app.use(logger("dev"));

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
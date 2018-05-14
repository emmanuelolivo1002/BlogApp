const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var app = express();

// APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


//MONGOOSE CONFIG
// Database setup
mongoose.connect("mongodb://localhost/restful_blog_app");

// Set up schema
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});
// Create model
var Blog = mongoose.model("Blog", blogSchema);

//Test created
// Blog.create({
//   title: "Test blog",
//   image: "http://img.dunyanews.tv/news/2017/July/07-06-17/news_big_images/395838_93202731.jpg",
//   body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
// });



// RESTFUL ROUTES

app.get("/", function(req, res) {
  res.redirect("/blogs");
});


// INDEX route
app.get("/blogs", function(req, res) {
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {blogs});
    }
  });
});

// NEW route
app.get("/blogs/new", function(req, res) {
  res.render("new");
});

//CREATE route
app.post("/blogs", function(req, res) {
  //create blog
  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      res.render("/new");
      console.log(err);
    } else {
      //redirect to index
      res.redirect("/blogs")
    }
  });
});



app.listen(process.env.PORT || 3000, function() {
  console.log("Listening to server");
});

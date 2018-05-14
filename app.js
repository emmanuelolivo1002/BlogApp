const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
var app = express();

// APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


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

  // Sanitize blog.body
  req.body.blog.body = req.sanitize(req.body.blog.body);

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

//SHOW route
app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, returnedBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: returnedBlog});
    }
  });
});

//EDIT route
app.get("/blogs/:id/edit", function(req, res) {
  // Find the blog that will be edited
  Blog.findById(req.params.id, function(err, returnedBlog) {
    if (err) {
      res.redirect("/blogs");
      console.log(err);
    } else {

      // Render edit form
      res.render("edit", {blog: returnedBlog});
    }
  });
});

//UPDATE ROUTES
app.put("/blogs/:id", function(req, res) {

  // Sanitize blog.body
  req.body.blog.body = req.sanitize(req.body.blog.body);

  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if (err) {
      res.redirect("/blogs/" + req.params.id + "/edit");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// DELETE route
app.delete("/blogs/:id", function(req, res) {
  //Destroy Blog
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
      res.redirect("/blogs/" + req.params.id);
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Listening to server");
});

const express = require('express');
const bodyParser = require('body-parser')

const app = express();
var items = ["Wake Up", "Go above", "And beyond"];
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

app.get("/",function(req,res){

var today = new Date();
var options = {
  month: "long",
  day: "numeric",
  weekday: "long"
}

var currentDate = today.toLocaleDateString("en-US", options);

res.render("list", {
  day:currentDate,
  newListItems:items
  });
})

app.post("/",function(req,res){

  var item = req.body.newItem;
  items.push(item);
  res.redirect("/");

})

app.listen(process.env.PORT || 3000, function(){

   console.log("Server is running on port 3000");

})

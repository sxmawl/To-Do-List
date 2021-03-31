const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash')

const app = express();
const items = ["Wake Up", "Go above", "And beyond"];
const workItems=[];

mongoose.connect("mongodb+srv://admin-saksham:Sak1302@cluster0.1nyke.mongodb.net/todoList2DB", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');



const itemSchema = mongoose.Schema({
  name: String 
})

const Item = mongoose.model("item",itemSchema);

const item1 = new Item({
  name: "Wake Up,"
})

const item2 = new Item({
  name: "Go Above"
})

const item3 = new Item({
  name: "And Beyond !"
})

const defaultItems = [item1,item2,item3];

const listSchema = mongoose.Schema({
  name: String,
  items: [itemSchema]
})

const List = mongoose.model("List",listSchema)

app.get("/", function(req, res) {


  Item.find({}, function(err,results){

    if(results.length == 0){

      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
      })
      res.redirect("/");
    }
    else{
    res.render("list", {listTitle: "Today", newListItems: results});
    }
    
  })
  

});


app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItem = new Item({
    name: itemName
  })

  if(listName == 'Today'){
    newItem.save();
    res.redirect("/");
  }else{
    
    List.findOne({name:listName}, function(err,result){
      result.items.push(newItem);
      result.save();
      res.redirect("/" + listName);

    })

  } 

});

app.get("/:customListName",function(req,res){

  const listName = _.capitalize(req.params.customListName);
  List.findOne({name: listName}, function(err, result){
    if(!err){
      if(!result){
        const list = new List({
          name: listName,
          items: defaultItems
        })

        list.save();
        res.redirect("/"+ listName);
        
    }else{

      res.render("list", {listTitle: listName, newListItems: result.items});
    
    }
  }
})
  

})

app.post("/delete", function(req, res){

  const itemID = req.body.removeItem.trim();
  const listName = req.body.listName;
  

  if(listName == 'Today'){
    Item.findByIdAndRemove(itemID,function(err){
      if(!err){
        res.redirect("/");
      }
    })
  
  }
  else{
    List.findOneAndUpdate({name: listName},{$pull: {items:{_id: itemID}}},function(err,result){
      if(!err){
        res.redirect("/"+ listName);
      }

    })
  }
  
 
});

app.get("/about", function(req,res){

res.render("about");
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen( port, function(){

   console.log("Server is running.");

})

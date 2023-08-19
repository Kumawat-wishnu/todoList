require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const date=require(__dirname+"/date.js");
//console.log(date());
const app=express();
let items=["buy food","cook food","eat food"];
let workItems=[];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
//app.get("/",function(req,res){res.sendFile(__dirname + "/views/list.ejs")});
mongoose.connect(process.env.MONGO_URL);   //"mongodb://127.0.0.1:27017/todoList"
const itemSchema=(
   {
        name:String
   }
)
const Itemm=mongoose.model("Itemm",itemSchema);
const item1=new Itemm(
   {
        name:"jalebi"
   }

);
const item2=new Itemm(
        {
           name:"rasgulla"
        }
) ;
const item3= new Itemm(
        {
        name:"gulabjamun"
        }
);
const defaultItems=[item1,item2,item3];
const listSchema={
        name:String,
        items:[itemSchema]
};
const List=mongoose.model("List",listSchema);

app.get("/",function(req,res){
          let day= date.getDate();
          Itemm.find({})
          .then((foundItems) => {
        //     console.log(foundItems);
        if(foundItems.length==0)
        {
           Itemm.insertMany(defaultItems)
  .        then(() => {
                console.log("Items inserted successfully!");
           })
               .catch((error) => {
                console.log(error);
          });
          res.redirect("/");

        }
        else{
           res.render("list",{listTitle:day, newListItems:foundItems});
        }
         //earliar there was items instead of foundItems
          })
          .catch((error) => {
            console.log(error);
          });
 
 
});
// 
app.get("/:customListName",function(req,res)
{
        const customListName=req.params.customListName;
        List.findOne({ name: customListName })
        .then((foundlist) => {
         if (foundlist) {
           res.render("list",{listTitle:foundlist.name, newListItems:foundlist.items});
         } else {
                const list=new List({
                        name:customListName,
                        items:defaultItems
                });
                list.save();
                res.redirect("/"+customListName);
         }
         })
        .catch((error) => {
    // Handle the error
         console.log("there is error");
         });
       
})
app.post("/",function(req,res){
        const itemName=req.body.newItem;
        const listName=req.body.list;
        const item=new Itemm({
                name:itemName
        });
        let day= date.getDate();
        if(listName===day)
        {
                item.save();
                res.redirect("/");
        }
        else
        { 
                List.findOne({ name: listName })
                .then((foundlist) => {
                 
                   foundlist.items.push(item);
                   foundlist.save();
                   res.redirect("/"+listName);
                 })
                .catch((error) => {
            // Handle the error
                 console.log("there is an error");
                 });   
        }
});
app.post("/delete",function(req,res)
{
   const checkedItemId=req.body.checkbox;
   Itemm.findByIdAndRemove(checkedItemId)
   .then(()=>{
        console.log("deletation successful");
        res.redirect("/");
   })
   .catch((error)=>{
        console.log("there is error");
   })
})

app.get("/work",function(req,res)
{
  res.render("list",{listTitle:"work_list",newListItems:workItems});
})

app.get("/about",function(req,res)
{
        res.render("about");
})
app.post("/work",function(req,res)
{  let item=req.body.newItem;
        workItems.push(item);
        res.redirect("/work");

})
const PORT=process.env.PORT;
app.listen(PORT,function(){
    console.log("server started on 3000");
})
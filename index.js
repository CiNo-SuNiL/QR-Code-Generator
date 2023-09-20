import inquirer from 'inquirer';
import qr from "qr-image";
import fs, { link } from "fs";
import express from "express";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname= dirname(fileURLToPath(import.meta.url))
// const bodyParser = require("body-parser");
import bodyParser from 'body-parser';

const app=express();
const port=3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.json());
// app.use(express.urlencoded({extended: true}));

app.get("/",(req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  const url =req.body.link;
  console.log(url);
  var qr_svg=qr.image(url);
  qr_svg.pipe(fs.createWriteStream(__dirname+"/public/images/qr_img.png"));

  fs.writeFile("URL.txt",url,(err)=>{
      if(err) throw err;
      console.log("The file has been saved!");
  });

  res.redirect("/created");

})

app.get("/created", (req, res) =>{
  fs.readFile('URL.txt', 'utf-8', (err, data) => {
    if(err) throw err;
    let m=data;
    res.render("created", {displayurl:m});
  });
});

app.listen(port, ()=>{
  console.log(`server runnimg on port ${port}`);
});

app.post("/created", (req, res) => {
  const submit=req.body.submit;
  if(submit==="Download"){
    res.download(__dirname+"/public/images/qr_img.png");
  }
  if(submit==="generate"){
    res.render("index");
  }
})

function check(link2){
    const url=link2;
    var qr_svg=qr.image(url);
    qr_svg.pipe(fs.createWriteStream("./public/images/qr_img.png"));

    fs.writeFile("URL.txt",url,(err)=>{
        if(err) throw err;
        console.log("The file has been saved!");
    });
  }
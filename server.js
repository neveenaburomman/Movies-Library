"use strict";

const express = require('express');
const jsonData = require("./Movie Data/data.json")
const app = express();


function movieBrief (title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}


function homeHandlerPage(req,res){
    let firstMovie=new movieBrief(jsonData.title, jsonData.poster_path, jsonData.overview);
      return res.status(200).json(firstMovie);
  }



  function favoriteHandler(req,res){
    return res.status(200).send("Welcome to Favorite page");
}
console.log("hi again");







app.get('/', homeHandlerPage);

app.get("/favorite", favoriteHandler);






app.listen(3000, () => {
    console.log(

        "i'm Listening to the  port 3000"
    );
})

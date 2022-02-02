"use strict";

const express = require('express');
const jsonData = require("./Movie Data/data.json")
const app = express();
const axios = require("axios");

const dotenv = require("dotenv");

dotenv.config();


const APIKEY=process.env.APIKEY;







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

function trendingHandlerpage(req,res){
       let trendingmovie=[];
      axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`)
           .then(value => {
         value.data.results.forEach (movie => {
             let firstMovie =new movieBrief(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview) 

             trendingmovie.push(firstMovie );
         });
         return res.status(200).json(trendingmovie)
         }).catch(error =>{
         errorHandler(error,req,res);
     })
 }
 ______________








 let topRatedPageHandler = (req, res) => {
    let topRated = [];
    axios
      .get(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${APIKEY}&language=en-US&page=1`
      )
      .then((value) => {
        value.data.results.forEach((movie) => {
          movie = new MoviesLibrary(
            movie.title,
            movie.poster_path,
            movie.overview
          );
          topRated.push(movie);
        });
        return res.status(200).json(topRated);
      });
  };




function errorHandler(message,req,res){
    
    const err={ status : 500,   message : message.message };

    return res.status(500).send(err);
}
function notFoundHandler(req,res){

    return  res.status(404).send("no end point with this name found");
  }



app.get('/trending',trendingHandlerpage);


app.get('/', homeHandlerPage);

app.get("/favorite", favoriteHandler);




app.use("*",notFoundHandler);

app.listen(3000, () => {
    console.log(

        "i'm Listening to the  port 3000"
    );
})

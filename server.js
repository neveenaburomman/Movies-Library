"use strict";


const express = require('express');
const jsonData = require("./Movie Data/data.json")
const app = express();
const axios = require("axios");
const dotenv = require("dotenv");
const  client  = require('pg/lib');
dotenv.config();

const pg = require('pg');
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);

const APIKEY=process.env.APIKEY;

const PORT = process.env.PORT;

app.use(errorHandler);


app.use(express.json());


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

function searchHandler(req,res){

    let querySearch=req.query.search;
    
    let searchmovie=[];

   axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${querySearch}`)
        .then(value => {
      value.data.results.forEach (movie => {
          let firstMovie =new movieBrief(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview) 

          searchmovie.push(firstMovie);
      });

      return res.status(200).json(searchmovie)
      }).catch(error =>{
      errorHandler(error,req,res);
  })}


  function topRatedHandler(req,res){
    
    let topRated=[];

   axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${APIKEY}&language=en-US&page=1`)
        .then(value => {
      value.data.results.forEach (movie => {
          let firstMovie =new movieBrief(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview) 

          topRated.push(firstMovie);
      });

      return res.status(200).json(topRated)
      }).catch(error =>{
      errorHandler(error,req,res);
  })}


  function genreHandler(req,res){

    let generMovie=[];

   axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKEY}&language=en-US`)
        .then(value => {
      value.data.results.forEach (movie => {
          let firstMovie =new movieBrief(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview) 

          generMovie.push(firstMovie);
      });

      return res.status(200).json(generMovie)
      }).catch(error =>{
      errorHandler(error,req,res);

  })}

  function updateHandler(req , res){
    const id = req.params.id;
    const movie = req.body;
    const sql = `UPDATE THEmovie SET comment=$1 WHERE id=${id} RETURNING *;`
    const values = [movie.comment];
   
    client.query(sql,values).then(data => {
        return res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res);
    })
};

function deleteHandler(req,res){

    const id = req.params.id;
    const sql = `DELETE FROM THEmovie WHERE id=${id};`

    client.query(sql).then(() => {
        return res.status(204).json([]);
    }).catch(error => {
        errorHandler(error, req, res);
    })
}

function getMovieHandler(req , res){

    const id = req.params.id;
    const sql = `SELECT * FROM THEmovie WHERE id=${id}`;

    client.query(sql).then(data => {
        
      return  res.status(200).json(data.rows);
    }).catch(error => {
        console.log(error);
        errorHandler(error, req, res);
    })
}






  



  function addMovieHandler(req, res) {
    let movie = req.body;
    let sql = `INSERT INTO favmovies(title, release_date, poster_path, overview, comment) VALUES($1, $2, $3, $4, $5) RETURNING *;`;
    let values = [movie.title, movie.release_date, movie.poster_path, movie.overview, movie.comment];

    client.query(sql, values).then((data) => {
        return res.status(201).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res);
    })
}

function getMoviesHandler(req, res) {
    
     const sql = `SELECT * FROM favMovies;`
    client.query(sql).then(data => {
        return res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res);
    })

}


function errorHandler(message,req,res){
    
    const err={ status : 500,  message : message.message };

    return res.status(500).send(err);
}


function notFoundHandler(req,res){

    return  res.status(404).send("no end point with this name found");
  }




  app.get('/', homeHandlerPage);
  
  app.get("/favorite", favoriteHandler);
  
  app.get('/trending',trendingHandlerpage);

  app.get('/search',searchHandler);

  app.get('/toprated',topRatedHandler);

  app.get('/genre',genreHandler);

  app.post("/addMovie" , addMovieHandler);

  app.get("/getMovies" , getMoviesHandler);

  app.put('/UPDATE/:id', updateHandler);

  app.delete('/DELETE/:id', deleteHandler);

  app.get('/getMovie/:id', getMovieHandler);

  app.use("*",notFoundHandler);






client.connect.then(()=>{
app.listen(3000, () => {
    console.log( `i'm Listening to the  port ${PORT}`);
});

});

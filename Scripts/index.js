const express = require('express')
const fetch = require('node-fetch');
const songModel = require('../Model/Songs.model')

const cors = require('cors');
const app = express();
app.use(cors())


app.use(express.json());
const axios = require('axios')

async function getSongs(artist){
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "f0d9fa046cmsh6df55b1f1af7fe2p15efc9jsn9790aeeb6432",
        "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
      },
    };
    try{
      const res= await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${artist}`,options)
      const response = await res.json();
      return response
    }
   catch(e){
    console.log(e)
   }
    // const  data = await res.json();
      // .then((response) => {
      //   //  response = await response.json()
        
      //   return response.json();
      // })
      // .then((response) => {
      //   return response;
          
      //   // if(response){
      //   //   response.map((ele)=>{
      //   //     songModel.create(ele)
      //   //   })
      //   // }
        
      // })
     
  };
  
  module.exports = getSongs
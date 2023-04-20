const express = require("express");
const getSongs = require('./Scripts/index')
const { userModel } = require("./Model/User.model.js");
const {songModel } = require("./Model/Songs.model");
const { connectDatabase } = require("./Config/db.js");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const {authentication} = require('./middlewares/authentication.js')
const cors = require('cors');
const app = express();

app.use(cors())


app.use(express.json());

app.post("/postSongs", async(req, res) => {
  const artist = req.query;
  const response = await getSongs("Badashah");
  if(response){
    try{
      for (let ele of response.data) {
       
        const { id, readable, title, title_short, title_version, link, duration, rank, explicit_lyrics, explicit_content_lyrics, explicit_content_cover, preview, md5_image, artist, album, type } = ele;
        const song = await songModel.findOne({title:title})
        if(!song){
        await songModel.create({ id, readable, title, title_short, title_version, link, duration, rank, explicit_lyrics, explicit_content_lyrics, explicit_content_cover, preview, md5_image, artist, album, type });
        }
      }

      const data = await songModel.find();
      res.send({
        msg: "Songs created successfully",
        data:data
      });
    } catch(err){
      console.log(err);
      res.send("Error creating songs");
    }
  }
});

app.get('/search', async (req, res) => {
  const query = req.query.q; // assuming the search query is passed as a query parameter 'q'
  const data = await songModel.find({ $text: { $search: query } });
  if (data) {
    res.send({ data: data });
  } else {
    res.send("No results found");
  }
});

app.post("/signup", async (req, res) => {
  const { email, name, password, dateOfBirth, gender } = req.body;

  const isUser = await userModel.findOne({ email: email });
  if (isUser) {
    res.send({ msg: "user already Exists" });
  } else {
    bcrypt.hash(password, 4, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        res.send({ msg: err });
      }
      const user = new userModel({ email, name, password: hash });

      try {
        await user.save();
        res.send({ user: user, msg: "Registered Sucessfully" });
      } catch (err) {
        console.log(err);
        res.send({ err: err });
      }

      console.log(user);
    });
  }
});



app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const User = await userModel.findOne({ email });
  console.log('User',User)
  if(User){
    const hashed_password = User.password;
    const user_id = User._id;
    //  console.log(user_id)
 

  bcrypt.compare(password, hashed_password, function (err, result) {
    if (err) {
      res.send({ msg: "Something went wrong" });
    }
    console.log(result);
    if (result) {
      var token = jwt.sign({ user_id }, process.env.SECRETE_KEY);
      console.log(token);
      res.send({ msg: "Login sucess", token });
    } else {
      res.send("Login Failed");
    }
  });

}
  
});



app.get('/getProfile', authentication, async(req,res)=>{
  //Authentication
  const {user_id} = req.body;
  const user = await userModel.findOne({_id:user_id});

  const {name, email} = user;
  res.send({name, email})
})







app.listen(8080, async () => {
  try {
    const connect = await connectDatabase;
    console.log("listening to the server");
  }
  catch(e){
    console.log(e);
  }
});

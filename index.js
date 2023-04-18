const express = require("express");
const { userModel  } = require("./Model/User.model.js");
const { BMIModel } = require("./Model/BMI.model.js");
const { connectDatabase } = require("./Config/db.js");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const {authentication} = require('./middlewares/authentication.js')
const cors = require('cors');
const app = express();

app.use(cors())


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Backend");
});



app.post("/signup", async (req, res) => {
  const { email, name, password } = req.body;

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
  
});



app.get('/getProfile', authentication, async(req,res)=>{
  //Authentication
  const {user_id} = req.body;
  const user = await userModel.findOne({_id:user_id});

  const {name, email} = user;
  res.send({name, email})
})



app.post('/calculateBMI',authentication,async (req,res)=>{
  const {height, weight, user_id} = req.body;

  const height_in_meter = Number(height)*0.3048;
  const BMI = Number(weight)/height_in_meter **2;

let bmi = new BMIModel({height:height_in_meter,weight,BMI, user_id })

  await bmi.save();
  res.send({bmi})
})


app.get('/getCalculations', authentication, async (req, res)=>{

  const {user_id} = req.body;
  const all_bmis = await BMIModel.find({user_id:user_id});
  res.send({history:all_bmis})
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

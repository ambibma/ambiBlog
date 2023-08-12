const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const User = require('./models/User')
const app = express();
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config()

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(cookieParser());
app.use(express.json())
mongoose.connect(process.env.MONGODB);

app.post('/register', async (req, res) => {
  const {username, password} = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);

  } catch(e) {
    res.status(400).json(e);
  }
  
})

app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);
   if (passOk) {
    //logged in
    jwt.sign({username,id:userDoc._id}, process.env.SECRET, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
   }
})

app.get('/profile', (req, res) =>{
  const {token} = req.cookies;
  jwt.verify(token, process.env.SECRET, {}, (err, info)=>{
    if (err) throw err;
    res.json(info);
  })
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok')
})
 
  

app.listen(4000)

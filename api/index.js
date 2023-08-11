const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const User = require('./models/User')
const bcrypt = require('bcrypt')
const app = express();

const salt = bcrypt.genSaltSync(10);

app.use(cors());
app.use(express.json())

 mongoose.connect('mongodb+srv://ambihidalgo25:kgJr92DoOf7Xii7w@cluster0.xztgfj2.mongodb.net/?retryWrites=true&w=majority');

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

app.listen(4000)
//mongodb+srv://ambihidalgo25:kgJr92DoOf7Xii7w@cluster0.xztgfj2.mongodb.net/?retryWrites=true&w=majority
//kgJr92DoOf7Xii7w
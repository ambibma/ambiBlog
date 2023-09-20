const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const User = require('./models/User')
const app = express();
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
require('dotenv').config();
const fs = require('fs');
const PostModel = require('./models/Post');


app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(cookieParser());
app.use(express.json())

const storage = multer.diskStorage({
  desination: "uploads",
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// app.use('ambiBlog/api/uploads', express.static(__dirname + '/uploads'));
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
  try {
    const userDoc = await User.findOne({username});
  if (!userDoc) {
    // If no user with the specified username is found, send an error response.
    return res.status(400).json({ error: 'User not found' });
  }

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
 } catch (err) {
    // Handle any other errors that may occur during the database query or JWT signing.
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/profile', (req, res) =>{
  const {token} = req.cookies;

  jwt.verify(token, process.env.SECRET, {}, (err, info)=>{
    if (err) throw err;
    res.json(info);
  })
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok')
}); 

app.post('/post', uploadMiddleware.single('files'), async (req,res) => {
  const {originalname,path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath);

  const {token} = req.cookies;

  jwt.verify(token, process.env.SECRET, {}, async (err,info) => {
    if (err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.id,
    });
    res.json(postDoc);
  
});
});

app.get('/post', async (req, res) => {

  res.json(await PostModel.find().populate('author', ['username']));
})
  

app.listen(4000)

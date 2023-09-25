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
const limiter = require('./limiter');
const roleCheckMiddleware = require('./roleCheckMiddleware');



app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(cookieParser());
app.use(express.json())
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/api', limiter);



// const storage = multer.diskStorage({
//   desination: "uploads",
//   filename: (req, file, cb) => {
//     console.log(file);
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

mongoose.connect(process.env.MONGODB);

// app.post('/register', async (req, res) => {
//   const {username, password} = req.body;
//   try {
//     const userDoc = await User.create({
//       username,
//       password: bcrypt.hashSync(password, salt),
//     });
//     res.json(userDoc);

//   } catch(e) {
//     res.status(400).json(e);
//   }
  
// })

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
    jwt.sign({ username, id: userDoc._id, userRole: userDoc.userRole }, process.env.SECRET, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id: userDoc._id,
        username,
        userRole: userDoc.userRole, // Include userRole in the response
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

app.get('/profile', async (req, res) => {
  const { token } = req.cookies;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);

    // Fetch the user document based on the decoded token's information
    const userDoc = await User.findById(decodedToken.id);

    if (!userDoc) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user information, including userRole
    res.json({
      id: userDoc._id,
      username: userDoc.username,
      userRole: userDoc.userRole, // Include userRole in the response
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok')
}); 

app.post('/post', roleCheckMiddleware, uploadMiddleware.single('files'),  async (req,res) => {
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

app.put('/post', roleCheckMiddleware, uploadMiddleware.single('files'), async (req, res) => {
  let newPath = null;
  if(req.file) {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
     newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }

  const {token}= req.cookies; 

  jwt.verify(token, process.env.SECRET, {}, async (err,info) => {
    if (err) throw err;
    const {id, title,summary,content} = req.body;
    const postDoc = await PostModel.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath: postDoc.cover,
    });
    res.json(postDoc);   
  
});
  
});

app.get('/post', async (req, res) => {

  res.json(await PostModel.find()
  .populate('author', ['username'])
  .sort({createdAt: -1})
  .limit (20)
  );
});

app.get('/post/:id', async(req, res) => {
  const {id} = req.params;
  const postDoc = await PostModel.findById(id).populate('author', ['username']);

  res.json(postDoc);
}) 

app.delete('/post/:id', roleCheckMiddleware, async (req, res) => {
  const postId = req.params.id;

  try {
    // Find the post by its ID
    const post = await PostModel.findById(postId);
    

    if (!post) {
      // If the post is not found, return a 404 Not Found response
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the current user is the author of the post
    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) throw err;
      
      const isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id);
      
      if (!isAuthor) {
        // If the current user is not the author, return a 403 Forbidden response
        return res.status(403).json({ error: 'You are not the author of this post' });
      }

      // Delete the post
      await post.deleteOne();

      // Return a success response
      res.json({ message: 'Post deleted successfully' });
    });
  } catch (error) {
    // Handle any errors that may occur during the deletion process
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  

app.listen(4000)

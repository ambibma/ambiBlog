const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const User = require('./models/User')
const app = express();
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const fs = require('fs');
const PostModel = require('./models/Post');

const limiter = require('./limiter');
const roleCheckMiddleware = require('./roleCheckMiddleware');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const { count } = require('console');




const router = express.Router();

const mongoURI = process.env.MONGODB_URI;

app.use(cors({credentials:true,origin:'https://ambi-blog.onrender.com'}));
app.use(cookieParser());
app.use(express.json())

app.use('/api', limiter);


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
  
  const conn = mongoose.connection;
  // const db = conn.getClient().db('test'); 

  
  const gfs = new mongoose.mongo.GridFSBucket(conn, {
    bucketName: 'fs',
});

  


const storage = new GridFsStorage({
  db: conn, 
  file: (req, file) => {
    return {
      filename: file.originalname, 
    };
  },
});
const uploadMiddleware = multer({ storage });



const streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', (error) => reject(error));
  });
};

module.exports = router;

//Login 

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const userDoc = await User.findOne({ username });
    
    if (!userDoc) {
      return res.status(400).json({ error: 'User not found' });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
      // User successfully authenticated

      // Create a JWT token
      const token = jwt.sign(
        { username, id: userDoc._id, userRole: userDoc.userRole },
        process.env.SECRET,
        { expiresIn: '1h' }
      );

      // Set the token as an HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // Expires in 1 hour
        sameSite: 'None', // Allow cross-site cookies
        secure: true, // Only send cookies over HTTPS
      });

      // Respond with user information
      res.json({
        id: userDoc._id,
        username,
        userRole: userDoc.userRole,
      });
    } else {
      // Incorrect password
      res.status(400).json('Wrong credentials');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/profile', async (req, res) => {
  const { token } = req.cookies;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);

    const userDoc = await User.findById(decodedToken.id);

    if (!userDoc) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: userDoc._id,
      username: userDoc.username,
      userRole: userDoc.userRole, 
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'Profile not found' });
  }
});


app.post('/logout', (req, res) => {
  res.cookie('token', null, {
    httpOnly: true,
    expires: new Date(0),
  }).json('ok');
}); 

//Populate Posts

app.get('/post', async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);

    const postsWithCoverURLs = await Promise.all(
      posts.map(async (post) => {
        const imageFilename = post.cover;
        const imageStream = gfs.openDownloadStreamByName(imageFilename);
        const imageBuffer = await streamToBuffer(imageStream);
        const imageURL = `data:image/webp;base64,${imageBuffer.toString('base64')}`;
        return { ...post._doc, coverURL: imageURL };
      })
    );

    res.json(postsWithCoverURLs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Create post with file upload

app.post('/post', roleCheckMiddleware, uploadMiddleware.single('files'),  async (req,res) => {

  const { filename } = req.file;
  const {token} = req.cookies;

  jwt.verify(token, process.env.SECRET, {}, async (err,info) => {
    if (err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      cover: filename,
      author:info.id,
    });
    res.json(postDoc);
  
});
});
//Edit post with new file upload
app.put('/post', roleCheckMiddleware, uploadMiddleware.single('files'), async (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
    if (err) throw err;

    const { id, title, summary, content } = req.body;
    const postDoc = await PostModel.findById(id);

    if (!postDoc) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

    if (!isAuthor) {
      return res.status(400).json('You are not the author');
    }

    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;

    if (req.file) {
      postDoc.cover = req.file.filename;
    }

    await postDoc.save();

    res.json(postDoc);
  });
});

//Post Details

app.get('/post/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const postDoc = await PostModel.findById(id).populate('author', ['username']);

    if (!postDoc) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const imageFilename = postDoc.cover;
    const readstream = gfs.openDownloadStreamByName(imageFilename);
    const imageBuffer = await streamToBuffer(readstream);
    const imageURL = `data:image/webp;base64,${imageBuffer.toString('base64')}`;
  
    res.json({ ...postDoc._doc, coverURL: imageURL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Delete post

app.delete('/post/:id', roleCheckMiddleware, async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) throw err;
      
      const isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id);
      
      if (!isAuthor) {
        return res.status(403).json({ error: 'You are not the author of this post' });
      }
      await post.deleteOne();
      res.json({ message: 'Post deleted successfully' });
    });
  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


  

app.listen(4000)

//  Init Dotenv
require('dotenv').config();

// Init DataBase
const db = require('./db/db');

// Init Models
const Post = require('./models/Post');
const Comment = require('./models/Comment');

const bodyParser = require('body-parser');

const express = require('express');

const path = require('path');

const mongoose =  require('mongoose');
// Server
const app = express();
// Init Static Files
app.use('/assets', express.static(path.join(__dirname, 'public')));
// Init Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Init Body Parser
app.use(bodyParser.urlencoded({extended: true}));

// Port Init
const PORT = process.env.PORT || 5000;

app.get('/', async (req, res) => {
    // Get Post Data
    let posts = await Post.find();

    // Send Post Data to index View
    res.render('index' , {
        pageTitle: 'Posts',
        posts,
    });
});
app.get('/create', (req, res) => {
    res.render('create', {
        pageTitle: 'Create',
    });
});
app.get('/comment/:id', async (req, res) => {
    // Validede If ID is Valid OBject ID
    const id = req.params.id;
    isInvalidId(res, id);

    const post = await Post.findOne({_id: req.params.id});
    let comments = post.comment;
    

    res.render('comment',  {
        pageTitle: 'Comments',
        post,
        comments,
    });
    
});
app.get('/edit/:id', async (req, res) => {
    // Validede If ID is Valid OBject ID
    const id = req.params.id;
    isInvalidId(res, id);

    const post = await Post.findById(req.params.id);


    res.render('edit',  {
        pageTitle: 'Edit',
        post,
    });
});
app.post('/save', (req, res) => {
    // Get Post Body
    const { body } = req.body;

    // Save Post in DB
    Post.create({ description: body}, (err, post) => {
        if(err) {

            return res.redirect('/create');
        };

        // Redirct in Post index
        res.redirect('/'); 
    })

    
});
app.post('/upload/:id', async (req, res) => {
    // Validede If ID is Valid OBject ID
    const id = req.params.id;
    isInvalidId(res, id);
    // Get Data Comment
    const post = await Post.findOne({_id: req.params.id});
    const { commentBody } = req.body;
    

    // Update comment and Push in post
    await Comment.updateOne({_id: id}, {commentBody}, {new: true});
    post.comment.push(commentBody);
    await post.save();
    

    // Redirct Show Route
    res.redirect(`/comment/${id}`);
});
app.post('/update/:id', async (req, res) => {
    // Validede If ID is Valid OBject ID
    const id = req.params.id;
    isInvalidId(res, id);
    // Get Post Description
    const { body } = req.body;

    // Update Post BY ID 
    await Post.findByIdAndUpdate(id, {description: body});

    // Redirct Show Post
    res.redirect(`/comment/${id}`);

});
app.post('/remove/:id', async (req, res) => {
    // Validede If ID is Valid OBject ID
    const id = req.params.id;
    isInvalidId(res, id);
    // Delete Post
    await Post.deleteOne({_id: req.params.id});

    // Redirct to index
    res.redirect('/')
});

const isInvalidId = (res, id) => {
    if(! mongoose.isValidObjectId(id)) {
        res.render('404', {
            pageTitle: 'Not Found',
        });
    };

}; 
app.listen(PORT, () => {
    console.log(`Server run on Port ${PORT}`);
});
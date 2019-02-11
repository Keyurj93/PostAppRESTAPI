const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const app = express();

mongoose.connect("mongodb://localhost/Postdb").then(()=>{
    console.log("Connected to database");
}).catch(()=>{
    console.log("Connection to database failed");
})

// parses request body 
app.use(bodyParser.json());
// parses url encoded data
app.use(bodyParser.urlencoded({ extended:false }));

// grant access to images folder. Any request with 'images' in it will be allowed.
app.use("/images",express.static(path.join("api/images")));

app.use((req,res,next)=>{
    // * denotes any server can call the api and the app will respond.
    // we can specify specific servers here
    res.setHeader('Access-Control-Allow-Origin','*');
    // the server sending requests may have the specified headers, though it's not 
    // necessary to have them. If sent request has non-default headers
    // apart from specified ones, access will be blocked
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    // allow the specified http verbs.
    // OPTIONS is important here. Angular sends an implicit request to server 
    // before sending any request to check if specified method is allowed    
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE,OPTIONS')    
    next();
})
app.use('/api/posts',postRoutes);
app.use('/api/user',userRoutes);
module.exports = app;
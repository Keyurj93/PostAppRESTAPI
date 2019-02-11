const User = require('../models/user');
// used to deal with jwts
const jwt = require('jsonwebtoken');
// used to generate hash from password
const bcrypt = require('bcrypt');



exports.createUser = (req,res,next)=>{
    // takes password and Number. Higher the Number, greater the security
    bcrypt.hash(req.body.password,10)
    .then(hash=>{
        const user = new User({
          email:req.body.email,
          password:hash  
        });
        user.save()
        .then(result=>{
            res.status(201).json({
                message:"User created successfully",
                result:result
            })
        }).catch(err=>{
            console.log("error ",err);
            res.status(500).json({
                message:"Invalid Authentication credentials"
            })
        })
    })  
}

exports.userLogin = (req,res,next)=>{
    // compare email
    let fetchedUser;
    User.findOne({email:req.body.email})
    .then(user=>{
        // user with given email doesnot exist
        if(!user){
        return res.status(401).json({
            message:"Auth Failed"
        })
        }
        fetchedUser = user;
        // user with given email exists. Check password and return 
        return bcrypt.compare(req.body.password,user.password);
    })
    // handle update one methods promise
    .then(result=>{
        if(!result){
            return res.status(401).json({
                message:"Auth Failed"
            })
        }
        // create json web token by using contents provided to sign method,
        // a secret password and
        const token = jwt.sign(
            {email:fetchedUser.email,userId:fetchedUser._id},
            process.env.JWT_KEY,
            {expiresIn:"1h"});
        res.status(200).json({
            token:token,
            expiresIn:3600,
            userId:fetchedUser._id
        })
    })
    .catch(err=>{
        return res.status(401).json({
            message:"Invalid Authentication credentials"
        })
    })
}
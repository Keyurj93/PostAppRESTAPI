const Post = require('../models/post');

exports.createPost = (req,res,next)=>{
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        title:req.body.title,
        content:req.body.content,
        showPanel:false,
        imagePath: url + "/images/" + req.file.filename,
        creator:req.userData.userId
    });
    post.save().then((createdPost)=>{
        res.status(201).json({
            message:"Post added successfully",
            post:{
                ...createdPost,
                id:createdPost._id
            }
        });
    })
    
}

exports.updatePost = (req,res,next)=>{
    let imagePath = req.body.imagePath;
    // if we get a file in request
    if(req.file){
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id:req.body.id,
        title:req.body.title,
        content:req.body.content,
        imagePath:imagePath,
        creator:req.userData.userId
    });
    Post.updateOne({_id:req.params.id,creator:req.userData.userId},post).then((result)=>{
        // console.log("Result ",result);
        if(result.n>0){
            res.status(200).json({message:"Update successful",post:post});
        }else{
            res.status(401).json({message:"Not Authorized!"});
        }
    })
}

exports.getPosts = (req,res,next)=>{
    // pagesize is the number of posts to be displayed selected by user
    // current page is the current page that is being rendered
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize&&currentPage){
        postQuery
        .skip(pageSize*(currentPage-1))
        .limit(pageSize);
    }
    postQuery.find()
    .then((documents)=>{
        fetchedPosts=documents;
        return Post.count();
    })
    .then(count=>{
        res.status(200).json({
            message:"Success in call",
            posts:fetchedPosts,
            maxPosts:count
        });
    })
    .catch(err=>{
        res.status(500).json({
            message:"Fetching posts failed"
        })
    });
}

exports.deletePost = (req,res,next)=>{
    Post.deleteOne({_id:req.params.id,creator:req.userData.userId}).then((result)=>{
        if(result.n>0){
            res.status(200).json({message:"Deleted successfully"});
        }else{
            res.status(401).json({message:"Not Authorized!"});
        } 
    })
    .catch(err=>{
        res.status(500).json({
            message:"Fetching post failed"
        })
    })
};

exports.getPost = (req,res,next)=>{
    Post.findById(req.params.id).then(post=>{
        if(post){
            res.status(200).json(post); 
        }else {
            res.status(404).json({message:'Post  not found'})
        }
    })
    .catch(err=>{
        res.status(500).json({
            message:"Fetching post failed"
        })
    })
};


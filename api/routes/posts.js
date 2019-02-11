const express = require('express');
const router = express.Router();
const PostsController = require('../controllers/posts');

const checkAuth = require('../middleware/check-auth');

const extractFile = require('../middleware/file');


// we expect a single image file in post request
router.post('', checkAuth, extractFile, PostsController.createPost)

router.get('',PostsController.getPosts);

router.delete('/:id',checkAuth,PostsController.deletePost);

router.put('/:id',checkAuth,extractFile,PostsController.updatePost);

router.get('/:id',PostsController.getPost)

module.exports = router;
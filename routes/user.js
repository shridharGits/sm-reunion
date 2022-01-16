const express = require('express')
const router = express.Router();

const {followUser, unfollowUser, getUser, createPost, deletePost, likePost, unlikePost, commentPost, getPost, getAllPosts} = require('../controllers/user')
const {signin, isSignedIn, isAuthencated} = require('../controllers/auth')

// router.param('id');
router.get('/user', isSignedIn, getUser)
router.post('/follow/:user_id', isSignedIn, followUser)
router.post('/unfollow/:user_id', isSignedIn, unfollowUser)
router.post('/posts/', isSignedIn, createPost)
router.delete('/posts/:post_id', isSignedIn, deletePost)
router.post('/like/:post_id', isSignedIn, likePost)
router.post('/unlike/:post_id', isSignedIn, unlikePost)
router.post('/comment/:post_id', isSignedIn, commentPost)
router.get('/posts/:post_id', isSignedIn, getPost)
router.get('/all_posts', isSignedIn, getAllPosts)

module.exports = router
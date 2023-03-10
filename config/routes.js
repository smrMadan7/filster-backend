let cors = require('cors');

module.exports = app =>{
    let router = require("express").Router();
    let userController = require('../controller/user');
    let postController = require('../controller/posts');
    let feedController = require('../controller/feed');

    router.post('/user/verify',userController.verify);
    router.get('/user/checkHandleAvailability/:handle',userController.checkHandle);
    router.post('/user/registerMember',userController.registerMember);
    router.post('/user/registerTeam',userController.registerTeam);
    // To remove profile from here and frontend | replace with profile
    router.get('/user/getProfile/:address',userController.getProfile);
    router.post('/user/getProfiles',userController.getProfiles);

    router.post('/post/create',postController.createPost);
    router.get('/post/getPostByWallet/:address',postController.getPostsByAddress);
    router.post('/post/like',postController.like);
    router.post('/post/comment',postController.comment);
    router.get('/post/get/:postId',postController.getPost);
    router.get('/post/comments/get/:postId',postController.getComments);
    router.post('/post/comments/edit',postController.editComment);

    router.get('/feed/getFeed/:address',feedController.getFeed);

    app.use('/api/', router);

}
const express= require("express");
const router= express.Router();
const Post = require('../models/post');
const checkAuth= require("../middleware/check-auth");
const extractFile= require("../middleware/file");
const PostController=require("../controllers/post");

router.post("",checkAuth,
extractFile,PostController.createPost);


router.get('',PostController.getPost);



router.put("/:id",
checkAuth,extractFile,
PostController.UpdatePost);



router.get("/:id",PostController.GetPostByID );

router.delete("/:id",checkAuth,PostController.DeletePost);

module.exports= router;


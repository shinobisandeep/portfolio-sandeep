const express= require("express");
const multer= require("multer");
const router= express.Router();
const Post = require('../models/post');
const checkAuth= require("../middleware/check-auth");

const MIME_TYPE_MAP= {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage= multer.diskStorage({
  destination: (req, file, cb) =>{
    const isValid= MIME_TYPE_MAP[file.mimetype];
    let error= new Error("Invalid mime Type");
    if(isValid){
      error= null;
    }
    cb(error,"backend/images");
  },
  filename: (req,file,cb)=>{
    const name= file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

router.post("",
multer({storage: storage}).single("image"),(req, res, next)=>{
  const url= req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(createdPost=>{
    console.log(createdPost);
    res.status(201).json({
      message: 'Post added successfully',
      post:{
        ...createdPost,
        id: createdPost._id

      }
    });
  });

});


router.get('',(req,res, next)=> {
  try{
    const pageSize= parseInt( req.query.pageSize);
    const currentPage= parseInt(req.query.page);
    const postQuery= Post.find();
    let fetchedPosts;
    console.log(req.query.pageSize);
    if(pageSize && currentPage){
      postQuery.skip(pageSize * (currentPage - 1))
      .limit(pageSize);
    }
    postQuery
    .then(documents=>{
      fetchedPosts=documents;
      x=Post.count
      console.log("sandeep12",x);
      return Post.count();

    })
    .then(count=>{
      console.log("heelo",count)
      res.status(200).json({
        message: 'Post Fetch Successfully',
        posts:fetchedPosts,
        maxPosts: count
      });
      console.log("bye",this.maxedPosts)
    });}
    catch(error){
      console.log(error);
    }


});



router.put("/:id",checkAuth,multer({storage: storage}).single("image"),
(req, res, next)=>{

  let imagePath=req.body.imagPath;
  if(req.file){
    const url= req.protocol + '://' + req.get("host");
    imagePath= url + "/images/" + req.file.filename;
  }


  const post={

    // _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath:imagePath,
    image:req.body.image
  };
try {
  Post.updateOne({_id: req.params.id},{$set:post}).then(result=>{


    res.status(200).json({message: 'Update successful'});

  });
} catch (error) {
  console.log(error);
}

});



router.get("/:id", (req, res, next)=>
{
  Post.findById(req.params.id).then(post=>{
    if(post){
      res.status(200).json(post);
    }
    else{
      res.status(404).json({message:'Post not Found'});
    }
  })
});

router.delete("/:id",checkAuth,
 (req, res, next) => {
 Post.deleteOne({_id: req.params.id}).then(result =>{
  console.log(result);
  res.status(200).json({ message: "post deleted!"});
 });
});

module.exports= router;


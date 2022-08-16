const Post = require('../models/post');


exports.createPost= (req, res, next)=>{
  const url= req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });

  post.save().then(createdPost=>{

    res.status(201).json({
      message: 'Post added successfully',
      post:{
        ...createdPost,
        id: createdPost._id

      }
    });
  })
  .catch(error =>{
    res.status(500).json({
      message:"creating a post failed"
    })
  });

}

exports.getPost= (req,res, next)=> {
  try{
    const pageSize= parseInt( req.query.pageSize);
    const currentPage= parseInt(req.query.page);
    const postQuery= Post.find();
    let fetchedPosts;

    if(pageSize && currentPage){
      postQuery.skip(pageSize * (currentPage - 1))
      .limit(pageSize);
    }
    postQuery
    .then(documents=>{
      fetchedPosts=documents;
      x=Post.count

      return Post.count();

    })
    .then(count=>{

      res.status(200).json({
        message: 'Post Fetch Successfully',
        posts:fetchedPosts,
        maxPosts: count
      });

    });}
    catch(error){
     res.status(500).json({
      message:"Couldn't fetch the Post "
     });
    }


}


exports.UpdatePost= (req, res, next)=>{

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
    image:req.body.image,
    creator:req.userData.userId
  };
try {
  Post.updateOne({_id: req.params.id,creator: req.userData.userId},{$set:post}).then(result=>{
    console.log(result);
    if(result.modifiedCount > 0){
      res.status(200).json({message:"Update  successful"})
    }
    else{
    res.status(401).json({message: 'Not Authorized!'});
    }
  });
} catch (error) {
 res.status(500).json({
  message:"Couldn't update post!"
 });
}

}

exports.GetPostByID= (req, res, next)=>
{
  Post.findById(req.params.id).then(post=>{
    if(post){
      res.status(200).json(post);
    }
    else{
      res.status(404).json({message:'Post not Found'});
    }
  }). catch(error=>{
    res.status(500).json({
      message:"Couldn't fetch the Post by ID "
     });
  })
}


exports.DeletePost= (req, res, next) => {
  Post.deleteOne({_id: req.params.id,creator:req.userData.userId}).then(result =>{
   if(result.deletedCount > 0){
     res.status(200).json({ message: "post deleted!"});
   }
   else{
   res.status(401).json({message: 'Not Authorized!'});
   }

  })
  .catch(error=>{
   res.status(500).json({
     message:"Couldn't delete the Post "
    });
   });
 }

const path= require("path");
const express= require('express');
const bodyParser= require('body-parser');
const app = express();
const Post = require('./models/post');
const cors= require('cors');
const mongoose=  require("mongoose");
const { createShorthandPropertyAssignment } = require('typescript');
const username= "sandeep";
const userRoutes= require('./routes/user')
const postRoutes= require('./routes/posts');

mongoose.connect(`mongodb+srv://${username}:D1sOjDYYiYgUWbhN@cluster0.fbgglgi.mongodb.net/node-angular?retryWrites=true&w=majority`
).then(()=>{
  console.log('Connected to database!');
})
.catch(()=>{
  console.log('Connection failed');
});


var corsOptions = {
 " origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
app.use(cors(corsOptions ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

// app.use((req,res,next)=>{
//   res.setHeader('Access-Control-Allow-Origin',"*");
//   res.setHeader('Access-Control-Allow-Headers',
//   "Origin, X-Requested-With, Content-Type, Accept");
//   res.setHeader("Access-Control-Allow-Methods",
//   "GET, POST,PATCH,PUT,DELETE,OPTIONS")
//   next();
// });

app.use("/api/posts",postRoutes);
app.use("/api/user",userRoutes);

module.exports= app;

const jwt= require("jsonwebtoken");
const { catchError } = require("rxjs");


module.exports=  (req, res, next) => {
  try{
const token= req.headers.authorization.split(" ")[1];
console.log("validating token",token);
jwt.verify(token, "secret_this_should_be_longer");

next();

  }
  catch(error){
    res.status(401).json({message: "Auth Failed"});
  }
};
